# JWT Token — Implementation & Usage

## Overview

`JWTToken` (`modules/server/src/utils/encryption/jwt.ts`) is a hand-rolled JSON Web Token implementation built on Node's built-in `crypto` module — no third-party JWT library. Tokens are signed with **HMAC-SHA256** and encoded in the standard `header.payload.signature` format defined by [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519).

The class manages two distinct token types:

| Token type    | Purpose                   | Class default expiry | Expiry set by callers        | Secret               |
| ------------- | ------------------------- | -------------------- | ---------------------------- | -------------------- |
| Access token  | Authorise API requests    | 1 hour               | 1 hour                       | `JWT_SECRET`         |
| Refresh token | Obtain a new access token | 30 days              | **7 days** (login & refresh) | `JWT_REFRESH_SECRET` |

> The `LoginUser` and `RefreshToken` actions always pass an explicit `exp`, so the class defaults only apply when a caller omits it. In practice refresh tokens live for **7 days**, not 30.

---

## Configuration

Two environment variables control signing:

```env
JWT_SECRET=<strong-random-string>
JWT_REFRESH_SECRET=<different-strong-random-string>
```

If either variable is absent, the constructor falls back to a hardcoded placeholder (`your_super_secret_key` / `your_super_refresh_secret_key`). **Always set both in production** — the placeholders are public knowledge, and reusing one value for both secrets defeats the separation between token types.

---

## Token structure

Every token is three base64url-encoded segments joined by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← header
.eyJ1c2VySWQiOiJhYmMiLCJleHAiOjE3MDB9  ← payload
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV    ← signature
```

**Header** — fixed for every token:

```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload** — the caller's claims plus a resolved `exp`:

```json
{ "userId": "abc", "email": "user@example.com", "role": "user", "exp": 1700000000 }
```

**Signature** — `HMAC-SHA256(base64url(header) + "." + base64url(payload), secret)`, base64url-encoded. Changing any character of the header or payload invalidates it.

---

## `JwtTokenPayload` type

```ts
type JwtTokenPayload = {
  exp: number; // Unix timestamp (seconds)
  [key: string]: string | number | undefined; // custom claims
};
```

`exp` is the only reserved claim. All other fields pass through verbatim and are returned on successful verification.

---

## Public API

### `base64UrlEncode(payload: string): Promise<string>`

Encodes a UTF-8 string to base64url: strips `=` padding, replaces `+` → `-` and `/` → `_`.

```ts
const encoded = await jwt.base64UrlEncode('{"alg":"HS256"}');
// → "eyJhbGciOiJIUzI1NiJ9"
```

### `base64UrlDecode(payload: string): Promise<string>`

Reverses base64url encoding back to a UTF-8 string, re-padding the input before decoding.

```ts
const decoded = await jwt.base64UrlDecode('eyJhbGciOiJIUzI1NiJ9');
// → '{"alg":"HS256"}'
```

### `generateToken(payload): Promise<string>`

Signs an access token with `JWT_SECRET`. If `payload.exp` is omitted (or falsy), it defaults to **now + 1 hour**.

```ts
const token = await jwt.generateToken({
  exp: Math.floor(Date.now() / 1000) + 3600,
  userId: 'abc',
  email: 'user@example.com',
  role: 'user',
});
```

### `verifyToken(token: string): Promise<JwtTokenPayload | null>`

Verifies an access token against `JWT_SECRET` and returns its payload, or `null` when:

- the token does not have exactly 3 segments,
- the signature does not match, or
- the `exp` claim is present and in the past.

```ts
const payload = await jwt.verifyToken(token);
if (!payload) {
  // token invalid or expired
}
```

### `generateRefreshToken(payload): Promise<string>`

Signs a refresh token with `JWT_REFRESH_SECRET`. If `payload.exp` is omitted, it defaults to **now + 30 days** (callers in this codebase pass a 7-day `exp`).

```ts
const refreshToken = await jwt.generateRefreshToken({
  exp: Math.floor(Date.now() / 1000) + 604800,
  userId: 'abc',
});
```

Refresh tokens are long-lived and must be stored securely — the server delivers them only as an `httpOnly` cookie. They are not accepted by `verifyToken`.

### `verifyRefreshToken(token: string): Promise<JwtTokenPayload | null>`

Verifies a refresh token against `JWT_REFRESH_SECRET`, with the same `null` cases as `verifyToken`.

```ts
const payload = await jwt.verifyRefreshToken(refreshToken);
if (payload) {
  const newAccessToken = await jwt.generateToken({ ...payload, exp: undefined });
}
```

---

## Internal design

The four `generate*` / `verify*` methods are thin wrappers around two private helpers:

```
generateToken(payload)        →  sign(payload, secretKey,        now + 1h)
generateRefreshToken(payload) →  sign(payload, refreshSecretKey, now + 30d)

verifyToken(token)            →  verify(token, secretKey)
verifyRefreshToken(token)     →  verify(token, refreshSecretKey)
```

- **`sign(payload, secret, defaultExp)`** — builds the header and payload objects (resolving `exp`), base64url-encodes both, computes `HMAC-SHA256(header.payload, secret)` via `.digest('base64url')`, and returns the assembled token.
- **`verify(token, secret)`** — splits on `.`, recomputes the expected signature, compares with `crypto.timingSafeEqual`, then checks expiry.

The algorithm, encoding, and validation rules are therefore defined exactly once.

---

## Token lifecycle

The refresh token never reaches JavaScript on the client — it lives in an `httpOnly`, `secure`, `sameSite: strict` cookie set by `AuthController`. The access token is returned in the response body and held in the Redux store. Refresh tokens are also persisted server-side via `SessionDAO` and **rotated on every refresh** (the previous session token is invalidated).

```
  Client                          Server
    │                                │
    │── POST /auth/login ───────────▶│  verify credentials
    │                                │  generateToken() + generateRefreshToken()
    │                                │  SessionDAO.storeRefreshToken()
    │◀── { success, token } ─────────│  Set-Cookie: refreshToken (httpOnly)
    │                                │
    │── GET /api/resource ──────────▶│
    │   Authorization: Bearer token  │  verifyToken()
    │◀── 200 OK ─────────────────────│
    │                                │
    │  (access token expires)        │
    │                                │
    │── GET /auth/refresh ──────────▶│  reads refreshToken cookie
    │   Cookie: refreshToken         │  verifyRefreshToken()
    │                                │  rotate: invalidate old + store new session
    │◀── { success, token } ─────────│  Set-Cookie: new refreshToken
    │                                │
    │── POST /auth/logout ──────────▶│  verifyRefreshToken() + clear session
    │◀── { success } ────────────────│  Set-Cookie: refreshToken="" (maxAge: 0)
```

---

## Security notes

**Timing-safe comparison** — signature verification uses `crypto.timingSafeEqual` instead of `===`. String equality short-circuits on the first mismatched byte, leaking timing information an attacker can use to forge signatures byte by byte; `timingSafeEqual` takes constant time regardless of where the mismatch occurs.

**Separate secrets** — access and refresh tokens use different signing keys, so neither kind of token is accepted by the other verifier, and compromising one secret does not compromise the other.

**Expiry enforcement** — `verify()` rejects any token whose `exp` is in the past, even with a valid signature. Note the check is conditional (`payload.exp && …`): a token signed **without** an `exp` claim never expires. All call sites in this codebase set `exp`, but the class itself does not force it.

**Short-lived access tokens** — the 1-hour access token minimises the exposure window if intercepted. The longer-lived refresh token is acceptable because it is confined to an `httpOnly` cookie, stored server-side per session, and rotated on every use.

**Known caveats** —

- `crypto.timingSafeEqual` throws (rather than returning `false`) when the two buffers differ in length, and `JSON.parse` throws on a malformed payload segment; a garbled token can therefore reject with an exception instead of resolving to `null`. Callers should treat any `verify*` failure — `null` or thrown — as an invalid token.
- The header is never inspected during verification, so the `alg` field is effectively ignored; this is safe here because the secret and algorithm are fixed server-side, but it means the implementation is not interoperable with tokens signed by other algorithms.
