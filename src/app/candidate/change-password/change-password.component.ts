import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

import { ChangePasswordService } from './change-password.service';
import { CommonMethodsService } from '../services/common-method.service';
import { CandidateService } from '../services/candidate.service';
import { Candidate } from '../candidate.model';
import { GET_PHOTO_URL } from '../../apis.constant';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers : [ ChangePasswordService ]
})
export class ChangePasswordComponent implements OnInit {

  showSuccessMessage: boolean;
  message: string;
  candidate: Candidate;
  errorMessage:any = [];
  hasError: boolean = false;
  changePasswordForm: any;
  passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  profilePicUrl = GET_PHOTO_URL + 'WT/lateral/';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private changePasswordService : ChangePasswordService,
    private candidateService : CandidateService,
    private commonMethodsService : CommonMethodsService
  ) { }

  ngOnInit() {
    this.createForm();
    this.getCandidate();
  }

  getAuthToken(grant_type?,refresh_token?, client_id?){
    this.changePasswordService.getRefreshToken().subscribe()
  }

  getProfilePic(){
    if(this.candidate !== undefined){
      return this.profilePicUrl 
      + this.candidate.resumeNumber;
    }else return  'assets/images/profile-photo.png'
  }


  getCandidate(){
    this.candidate = this.candidateService.getCurrentCandidate();
  }
  succuessGetJobDetails(res){

  }

  cancel(){
    this.hasError = false;
    this.commonMethodsService.bodyScrollable();
    this.errorMessage = [];
  }

  errorHandler(error){

  }

  onSubmit(formValues){
    if(this.changePasswordForm.invalid){
      this.hasError = true;
    this.commonMethodsService.bodyUnscrollable();      
      if(this.changePasswordForm.get('currentPassword').errors != null && this.changePasswordForm.get('currentPassword').errors.required){
        this.errorMessage.push("Current Password can't blank")
      }
       if(this.changePasswordForm.get('newPassword').errors != null && this.changePasswordForm.get('newPassword').errors.required){
        this.errorMessage.push("New Password can't blank")
      }
       if(this.changePasswordForm.get('newPassword').errors != null && this.changePasswordForm.get('newPassword').errors.pattern){
        this.errorMessage.push('The password does not match. Please enter the correct password. The password must be alphanumeric with upper case, lower case, special character and minimum 8 characters long.')
      }
       if(this.changePasswordForm.get('cnewPassword').errors != null && this.changePasswordForm.get('cnewPassword').errors.MatchPassword){
        this.errorMessage.push('Confirm password mismatch')
      }
      return false;
    }
    this.changePasswordService.changePassword(formValues).subscribe(res => {
      this.onPasswordSubmittedSuccess(res)
    },
  error => {this.passwordrrorHandler(error)})
  }

  passwordrrorHandler(error){
    // alert(error.message)
  }

  onPasswordSubmittedSuccess(res){
    if(res.status === "Success"){
      this.commonMethodsService.bodyUnscrollable();
      this.showSuccessMessage = true;
      this.message  = res.message;
    }else if(res.status === "Failure"){
      this.commonMethodsService.bodyUnscrollable();
      this.hasError = true;
      this.errorMessage.push(res.message);
    }
  }

  closePop(){
    this.commonMethodsService.bodyScrollable();
    this.showSuccessMessage = false;
  }

  //After confirm change password success message 
  navigateToDashboard(){
    this.commonMethodsService.bodyScrollable();
    this.showSuccessMessage = false;
    this.router.navigate(['/candidates/dashboard'])
  }

  createForm(){
    this.changePasswordForm = 
    this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      cnewPassword: ['', Validators.required]
    }, {
      validator: this.matchPassword // your validation method
    })
  }
  
    matchPassword(AC: AbstractControl) {
      let newPassword = AC.get('newPassword').value; // to get value in input tag
      let cnewPassword = AC.get('cnewPassword').value; // to get value in input tag
       if(newPassword != cnewPassword) {
        AC.get('cnewPassword').setErrors( {MatchPassword: true} )
       } else {
        // delete AC.get('cnewPassword').errors['MatchPassword'];
        return null
       }
   }

   get f() { return this.changePasswordForm.controls; }

   reset(){
     this.changePasswordForm.reset();
   }
}
