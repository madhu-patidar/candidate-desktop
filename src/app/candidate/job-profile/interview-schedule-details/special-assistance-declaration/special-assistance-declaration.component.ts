import { Component, OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Input } from '@angular/core';

@Component({
  selector: 'app-special-assistance-declaration',
  templateUrl: './special-assistance-declaration.component.html',
  styleUrls: ['./special-assistance-declaration.component.css']
})
export class SpecialAssistanceDeclarationComponent implements OnInit {


  disabilitiesArrayList = []
  constructor() { }

  @Output() declaredSpecialAssistance = new EventEmitter(); 
  @Input() disabilitiesArray: any[] ;

  ngOnInit() {
    if(this.disabilitiesArray !== undefined){
      this.disabilitiesArrayList = JSON.parse(JSON.stringify(this.disabilitiesArray));
    }
  }

  popCancel(){
    let result ={
      cancel : true,
      disabilitiesArray: this.disabilitiesArray 
    }
    this.declaredSpecialAssistance.emit(result);
  }


  onSubmit(){
    let result ={
      cancel : false,
      disabilitiesArray: this.disabilitiesArrayList
    }
    this.declaredSpecialAssistance.emit(result);
  }



  onClick(event){
    let search_term = event.target.value;
    let checked =  event.target.checked;
    if(!checked){
      for (var i=this.disabilitiesArrayList.length-1; i>=0; i--) {
        if (this.disabilitiesArrayList[i] === search_term) {
            this.disabilitiesArrayList.splice(i, 1);
        }
      }
    }else{
      this.disabilitiesArrayList.push(search_term);
    }
  }

  check(value){
    let checked = false;
    for (var i=this.disabilitiesArrayList.length-1; i>=0; i--) {
      if (this.disabilitiesArrayList[i] === value) {
        checked = true
      }
    }
    return checked
  }



}
