import { Component, OnInit } from '@angular/core';
import { EventEmitter } from 'events';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-forgot-user-id',
  templateUrl: './forgot-user-id.component.html',
  styleUrls: ['./forgot-user-id.component.css']
})
export class ForgotUserIdComponent implements OnInit {

  emailField:boolean = false;
  contactField:boolean = false;
  returnUrl:string;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onKey(value){
    if(value !== "" ){
      this.emailField=true;
    }else{     
      this.emailField=false;
    }
  }

  onKeyContact(value){
    if(value !== "" ){
      this.contactField=true;
    }else{     
      this.contactField=false;
    }
  }

  back(){
    this._location.back();
  }

  navigateToLoginPage(){
    this.router.navigate(['/auth/login'])
  }

}
