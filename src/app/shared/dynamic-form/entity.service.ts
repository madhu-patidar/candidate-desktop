import { Injectable }       from '@angular/core';
import { DatePipe } from '@angular/common';

import { DropdownEntity } from './entity-dropdown';
import { EntityBase }     from './entity-base';
import { TextboxEntity }  from './entity-textbox';
import { RadioButtonEntity }  from './entity-radio-button';
import { DateFieldEntity } from './entity-date-field';
import { NumberFieldEntity } from './entity-number-field';


@Injectable()
export class EntityService {

  // TODO: get from a remote source of Entity metadata
  // TODO: make asynchronous\

  constructor(private datePipe : DatePipe){

  }
  
  getEntities(data?) {
    let entitys: EntityBase<any>[] 
    = []

    for (let d of data) {
      // if(d.nameOfSubEntityField !=='Nature of Separation'){
        if(d.subentityFieldType === 'Text' || d.entityFieldType === 'Text'){
          entitys.push( new TextboxEntity({
            label: d.nameOfSubEntityField === undefined ? d.name : d.nameOfSubEntityField ,
            key:  d.subEntityId === undefined ? d.name : d.subEntityId ,
            value: d.value,
            required: d.mandatory === 'Y' ? true : false,
            order: d.orderNumber
          }),
        )}

        if(d.subentityFieldType === 'SelectList'|| d.entityFieldType === 'SelectList'){
          entitys.push(  new DropdownEntity({
            key: d.subEntityId === undefined ? d.name : d.subEntityId,
            label: d.nameOfSubEntityField === undefined ? d.name : d.nameOfSubEntityField ,
            value: d.value,
            required: d.mandatory === 'Y' ? true : false,
            options: <any>d['SelectList'] ,
            order: d.orderNumber
          }),
        )}

        if(d.subentityFieldType === 'RadioButton' || d.entityFieldType === 'RadioButton'){
          entitys.push(  new RadioButtonEntity({
            key: d.subEntityId === undefined ? d.name : d.subEntityId,
            label: d.nameOfSubEntityField === undefined ? d.name : d.nameOfSubEntityField,
            value: d.value,
            required: d.mandatory === 'Y' ? true : false,
            options: <any>d['SelectList'] ,
            order: d.orderNumber,
            name : d.name
          }),
      )}
      if(d.subentityFieldType === 'Number' || d.entityFieldType === 'Number'){
        entitys.push(  new NumberFieldEntity({
          label: d.nameOfSubEntityField === undefined ? d.name : d.nameOfSubEntityField ,
          key:  d.subEntityId === undefined ? d.name : d.subEntityId ,
          value: d.value,
          required: d.mandatory === 'Y' ? true : false,
          order: d.orderNumber
        }),
    )}
      if(d.subentityFieldType === 'DateType' || d.entityFieldType === 'DateType'){
        entitys.push(  new DateFieldEntity({
          label: d.nameOfSubEntityField === undefined ? d.name : d.nameOfSubEntityField ,
          key:  d.subEntityId === undefined ? d.name : d.subEntityId ,
          value: this.datePipe.transform(d.value, 'yyyy-MM-dd'),
          required: d.mandatory === 'Y' ? true : false,
          order: d.orderNumber
        }),
    )}
    // }
    }
  
    return entitys.sort((a, b) => a.order - b.order);
  }
}