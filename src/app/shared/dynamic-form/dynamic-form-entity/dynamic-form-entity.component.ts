import { Component, OnInit, Input } from '@angular/core';


import { FormGroup }        from '@angular/forms';
 
import { EntityBase }     from '../entity-base';
import { DatePipe } from '@angular/common';
 
@Component({
  selector: 'app-entity',
  templateUrl: './dynamic-form-entity.component.html'
})
export class DynamicFormEntityComponent {
  @Input() entity: EntityBase<any>;
  @Input() form: FormGroup;
  maxDate: string;

  constructor(private datePipe : DatePipe ){
    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
 
  sorting(value){
   return value.sort((a, b) => a.itemDescription < b.itemDescription ? -1 : 1);
  }
  get isValid() { return this.form.controls[this.entity.key].valid; }
}

