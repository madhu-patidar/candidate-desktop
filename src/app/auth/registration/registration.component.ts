import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  showRegistrationForm:boolean = false;
  showOTPForm:boolean = true;
  showSuccessMessage:boolean = false;

  otpForm : FormGroup;
  registrationForm : FormGroup;

  constructor(
    private router : Router
  ) { }

  ngOnInit() {
    this.createForm()
  }



  onRegistration(){
    this.showRegistrationForm = false;
    this.showOTPForm = false;
    this.showSuccessMessage = true;
  }

  onVarify(){
    this.showRegistrationForm = true;
    this.showOTPForm = false;
    this.showSuccessMessage = false;
  }


  createForm(){
    this.otpForm = new FormGroup({
      otp: new FormControl('', Validators.required),
    });

    this.registrationForm = new FormGroup({
      userId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }




  navigateToLoginPage(){
    this.router.navigate(['/auth/login'])
  }

}
