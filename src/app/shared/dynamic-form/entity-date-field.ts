import { EntityBase } from './entity-base';

export class DateFieldEntity extends EntityBase<string> {
  controlType = 'dateField';
  type: Date;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}