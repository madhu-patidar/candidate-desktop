import { EntityBase } from './entity-base';

export class RadioButtonEntity extends EntityBase<string> {
  controlType = 'radio';
  options: {itemDescription: string, itemValue: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
