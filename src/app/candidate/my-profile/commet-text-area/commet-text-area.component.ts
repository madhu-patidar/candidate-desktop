import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-commet-text-area',
  templateUrl: './commet-text-area.component.html',
  styleUrls: ['./commet-text-area.component.css']
})
export class CommetTextAreaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.initCommentForm();
  }

  commentForm:FormGroup;

  initCommentForm(){
    this.commentForm = new FormGroup({
      comment: new FormControl(''),
    });
  }

  commentFormValue(){
    return this.commentForm.value.comment;
  }

}
