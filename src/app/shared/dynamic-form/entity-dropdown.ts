import { EntityBase } from './entity-base';

export class DropdownEntity extends EntityBase<string> {
  controlType = 'dropdown';
  options: {itemDescription: string, itemValue: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
