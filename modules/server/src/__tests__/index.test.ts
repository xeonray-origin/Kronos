describe('server smoke test', () => {
  it('runs in node environment', () => {
    expect(typeof process).toBe('object');
    expect(process.versions.node).toBeDefined();
  });
});
