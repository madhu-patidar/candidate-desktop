import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  emailField:boolean = false;
  contactField:boolean = false;
  newPasswordField: boolean = false;
  confirmPasswordField: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location
  ) { }

  step1:boolean = true;
  step2:boolean = false;
  step3:boolean = false;
  returnUrl:string;
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  navigateToLoginPage(){
    this.router.navigate(['/auth/login'])
  }


  clickStep2(){
    this.step1 = false;
    this.step2 = true;
    this.step3 = false;
  }
  
  clickStep3(){
    this.step1 = false;
    this.step2 = false;
    this.step3 = true;
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

  onKeyNewPassword(value){
    if(value !== "" ){
      this.newPasswordField=true;
    }else{     
      this.newPasswordField=false;
    }
  }

  onKeyConfirmPassword(value){
    if(value !== "" ){
      this.confirmPasswordField=true;
    }else{     
      this.confirmPasswordField=false;
    }
  }

  back(){
    this._location.back();
  }


}
