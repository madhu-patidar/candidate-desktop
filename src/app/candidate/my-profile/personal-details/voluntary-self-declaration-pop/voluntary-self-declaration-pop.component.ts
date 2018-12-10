import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-voluntary-self-declaration-pop',
  templateUrl: './voluntary-self-declaration-pop.component.html',
  styleUrls: ['./voluntary-self-declaration-pop.component.css']
})
export class VoluntarySelfDeclarationPopComponent implements OnInit {

  voluntaryEelfDeclarationPop = true;
  constructor() { }

  @Output() valueChange = new EventEmitter(); 

  ngOnInit() {
  }

  popCancel(){
    this.valueChange.emit('false');
  }

}
