import _ from 'lodash';

export default class Entity<T> {
  constructor(attributes: Partial<T>) {
    _.assign(this, attributes);
  }
}
