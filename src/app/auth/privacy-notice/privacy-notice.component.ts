import { Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonMethodsService } from '../../candidate/services/common-method.service';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styleUrls: ['./privacy-notice.component.css']
})
export class PrivacyNoticeComponent implements OnInit {

  declinePop:boolean = false;
  checked : boolean = false;
  @ViewChild('checkBox')checkBox : ElementRef;

  constructor(
    private router: Router,
    private commonMethodsService : CommonMethodsService
  ) { }

  // isInvalid : true;

  ngOnInit() {
  }

  cancel(){
    this.declinePop = false;
    this.commonMethodsService.bodyScrollable();
  }

  isInvalid(){
    return !this.checked;
  }

  onClick(){
    this.checked = this.checkBox.nativeElement.checked;
  }

  onAccept(){
    this.router.navigate(['/auth/registration'])
  }

  onDecline(){
    window.scroll(0,0)
    this.declinePop = true;
    this.commonMethodsService.bodyUnscrollable();
  }



}
