import { Component, OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Input } from '@angular/core';


@Component({
  selector: 'app-self-declaration-pop',
  templateUrl: './self-declaration-pop.component.html',
  styleUrls: ['./self-declaration-pop.component.css']
})
export class SelfDeclarationPopComponent implements OnInit {

  showAnyOther: boolean = false;
  anyOtherDisability

  @Output() closePopModal = new EventEmitter(); 
  @ViewChild('anyOther') anyOther: ElementRef;
  @Output() selfDeclaration = new EventEmitter(); 
  @Input() disabilitiesArray: any[] ;

  
  onAnyOther(){
    this.showAnyOther = this.anyOther.nativeElement.checked
  }

  disabilitiesArrayList = []
  constructor() { }



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
    this.selfDeclaration.emit(result);
  }


  onSubmit(){
    let result ={
      cancel : false,
      disabilitiesArray: this.disabilitiesArrayList
    }
    this.selfDeclaration.emit(result);
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
    console.log('this.disabilitiesArrayList',this.disabilitiesArrayList)
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
