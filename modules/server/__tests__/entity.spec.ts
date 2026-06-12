import Entity from '../src/entities/entity';

class TestEntity extends Entity<TestEntity> {
  declare name?: string;
  declare value?: number;
}

describe('Entity', () => {
  it('assigns provided attributes to the instance', () => {
    const entity = new TestEntity({ name: 'test', value: 42 });

    expect(entity.name).toBe('test');
    expect(entity.value).toBe(42);
  });

  it('assigns only the provided subset of attributes', () => {
    const entity = new TestEntity({ name: 'partial' });

    expect(entity.name).toBe('partial');
    expect(entity.value).toBeUndefined();
  });
});
