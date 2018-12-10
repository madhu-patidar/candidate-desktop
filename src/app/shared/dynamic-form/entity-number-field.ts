import { EntityBase } from './entity-base';

export class NumberFieldEntity extends EntityBase<string> {
  controlType = 'numberField';
  type: number;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}