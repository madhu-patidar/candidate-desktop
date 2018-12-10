import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EntityBase } from './entity-base';

@Injectable()
export class EntityControlService {
  constructor() { }

  specialCharacterPattern = ''
  decimalPattern = /^[0-9]+$/;
  toFormGroup(entitys: EntityBase<any>[], isEntityDisabled:boolean = false ) {
    let group: any = {};

    entitys.forEach(entity => {
        group[entity.key] = entity.required ? new FormControl({value : entity.value || '', disabled: isEntityDisabled}, Validators.required)
        : new FormControl({value : entity.value || '', disabled: isEntityDisabled});
    });
    return new FormGroup(group);
  }
}