export class EntityBase<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    isDecimal: string;
    specialCharacter: string;
   
    constructor(options: {
        value?: T,
        key?: string,
        label?: string,
        required?: boolean,
        name?:string
        order?: number,
        controlType?: string
      } = {}) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.required = !!options.required;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
    }
  }

  // "itemDescription": "Bangladesh",
  // "itemValue": "BD"