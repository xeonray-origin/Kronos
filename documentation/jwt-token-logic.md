# JWT Token — Implementation & Usage

## Overview

`JWTToken` (at `modules/server/src/utils/encryption/jwt.ts`) is a hand-rolled JSON Web Token implementation built on Node's built-in `crypto` module. It does not depend on any third-party JWT library. Tokens are signed using **HMAC-SHA256** and encoded in the standard `header.payload.signature` format defined by [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519).

The class manages two distinct token types:

| Token Type    | Purpose                   | Default Expiry | Secret               |
| ------------- | ------------------------- | -------------- | -------------------- |
| Access token  | Authorise API requests    | 1 hour         | `JWT_SECRET`         |
| Refresh token | Obtain a new access token | 30 days        | `JWT_REFRESH_SECRET` |

---

## Configuration

Two environment variables control signing:

```env
JWT_SECRET=<strong-random-string>
JWT_REFRESH_SECRET=<different-strong-random-string>
```

If either variable is absent the class falls back to a hardcoded default. **Always set both in production.** Using the same value for both secrets defeats the security separation between token types.

---

## JWT Token Structure

Every token is three base64url-encoded segments joined by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← header
.eyJ1c2VySWQiOiJhYmMiLCJleHAiOjE3MDB9  ← payload
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV    ← signature
```

### Header

Fixed for every token:

```json
{ "alg": "HS256", "typ": "JWT" }
```

### Payload

A JSON object containing the claims passed by the caller plus a resolved `exp`:

```json
{ "userId": "abc", "email": "user@example.com", "exp": 1700000000 }
```

### Signature

`HMAC-SHA256(base64url(header) + "." + base64url(payload), secret)` encoded as base64url. Changing any character in the header or payload invalidates it.

---

## `JwtTokenPayload` Type

```ts
type JwtTokenPayload = {
  exp: number; // Unix timestamp (seconds)
  [key: string]: string | number | undefined; // custom claims
};
```

`exp` is the only reserved claim. All other fields are passed through verbatim and returned on successful verification.

---

## Public API

### `base64UrlEncode(payload: string): Promise<string>`

Encodes a UTF-8 string to base64url (strips `=` padding, replaces `+` → `-` and `/` → `_`).

```ts
const encoded = await jwt.base64UrlEncode('{"alg":"HS256"}');
// → "eyJhbGciOiJIUzI1NiJ9"
```

---

### `base64UrlDecode(payload: string): Promise<string>`

Reverses base64url encoding back to a UTF-8 string. Re-pads the input before decoding.

```ts
const decoded = await jwt.base64UrlDecode('eyJhbGciOiJIUzI1NiJ9');
// → '{"alg":"HS256"}'
```

---

### `generateToken(payload: JwtTokenPayload): Promise<string>`

Signs an access token with `JWT_SECRET`. If `payload.exp` is omitted, it defaults to **now + 1 hour**.

```ts
const token = await jwt.generateToken({
  exp: Math.floor(Date.now() / 1000) + 3600,
  userId: 'abc',
  email: 'user@example.com',
  role: 'user',
});
```

Returns a signed JWT string.

---

### `verifyToken(token: string): Promise<JwtTokenPayload | null>`

Verifies an access token against `JWT_SECRET`. Returns `null` if:

- The token does not have exactly 3 segments
- The signature does not match
- The `exp` claim is in the past

```ts
const payload = await jwt.verifyToken(token);
if (!payload) {
  // token invalid or expired
}
```

---

### `generateRefreshToken(payload: JwtTokenPayload): Promise<string>`

Signs a refresh token with `JWT_REFRESH_SECRET`. If `payload.exp` is omitted, it defaults to **now + 30 days**.

```ts
const refreshToken = await jwt.generateRefreshToken({ userId: 'abc' });
```

Refresh tokens are long-lived and should be stored securely (e.g. `httpOnly` cookie or encrypted store). They are not accepted by `verifyToken`.

---

### `verifyRefreshToken(token: string): Promise<JwtTokenPayload | null>`

Verifies a refresh token against `JWT_REFRESH_SECRET`. Returns the same `null` cases as `verifyToken`.

```ts
const payload = await jwt.verifyRefreshToken(refreshToken);
if (payload) {
  const newAccessToken = await jwt.generateToken({ ...payload, exp: undefined });
}
```

---

## Internal Design

The four `generate*` / `verify*` methods are thin wrappers around two private helpers:

```
generateToken(payload)        →  sign(payload, secretKey,        now + 1h)
generateRefreshToken(payload) →  sign(payload, refreshSecretKey, now + 30d)

verifyToken(token)            →  verify(token, secretKey)
verifyRefreshToken(token)     →  verify(token, refreshSecretKey)
```

`sign(payload, secret, defaultExp)` — builds the header and payload objects, base64url-encodes them, computes `HMAC-SHA256(header.payload, secret)` using `.digest('base64url')`, and returns the assembled token string.

`verify(token, secret)` — splits on `.`, recomputes the expected signature, compares with `crypto.timingSafeEqual`, then checks expiry.

This design means the algorithm, encoding, and validation rules are defined exactly once.

---

## Token Lifecycle

```
  Client                        Server
    │                              │
    │── POST /auth/login ─────────▶│
    │                              │  verify credentials
    │◀── { token, refreshToken } ──│  generateToken() + generateRefreshToken()
    │                              │
    │── GET /api/resource ────────▶│
    │   Authorization: Bearer token│  verifyToken()
    │◀── 200 OK ───────────────────│
    │                              │
    │  (access token expires)      │
    │                              │
    │── POST /auth/refresh ───────▶│
    │   { refreshToken }           │  verifyRefreshToken()
    │◀── { token } ────────────────│  generateToken()
    │                              │
    │── GET /api/resource ────────▶│
    │   Authorization: Bearer token│  verifyToken()
    │◀── 200 OK ───────────────────│
```

---

## Security Notes

**Timing-safe comparison** — signature verification uses `crypto.timingSafeEqual` instead of `===`. String equality short-circuits on the first mismatched byte, leaking timing information that can be exploited to forge tokens. `timingSafeEqual` always takes the same time regardless of where the mismatch occurs.

**Separate secrets** — access and refresh tokens use different signing keys. A refresh token cannot be passed to `verifyToken` and accepted, and vice versa. Compromising one secret does not compromise the other.

**Expiry enforcement** — `verify()` always checks `payload.exp` against `Date.now()`. A token with a past `exp` is rejected even if its signature is valid.

**Short-lived access tokens** — the 1-hour default minimises the window of exposure if an access token is intercepted. The refresh token's 30-day window is acceptable because it is used infrequently and should be stored more securely than the access token.
