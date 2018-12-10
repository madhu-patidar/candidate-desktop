import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CandidateService } from './../../services/candidate.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonMethodsService } from '../../services/common-method.service';
import { ChangePasswordService } from '../../change-password/change-password.service';
import { CANDIDATE_JOB_PROFILE_PATH_LIST } from '../job-profile.constant';
import { ToastrService } from 'ngx-toastr';
import { AlertPopService } from '../../../shared/components/alert-pop/alert-pop.service';

@Component({
  selector: 'app-offer-salary-stack',
  templateUrl: './offer-salary-stack.component.html',
  styleUrls: ['./offer-salary-stack.component.css']
})
export class OfferSalaryStackComponent implements OnInit {

  isDecline: boolean;
  hasError: boolean;
  message: string;
  failureMessage: any;
  monthlyGross: any;
  acceptedOffer: boolean = false;
  seekClarification :boolean = false
  loading = true;
  candidateDetails:any;
  commentsForm
  salaryDetails;
  AcceptComments = '';

  constructor(
    private router: Router,
    private commonMethodsService : CommonMethodsService,
    private candidateService : CandidateService,
    private changePasswordService : ChangePasswordService,
    private alertService: AlertPopService,
  ) { }

  ngOnInit() {

    this.candidateDetails = this.candidateService.getCurrentCandidate();
    this.createForm();
    if(this.candidateDetails.jobCode === 0 || this.candidateDetails.jobCode === '0' || this.candidateDetails.statuscode ==='INSAP' || this.candidateDetails.statuscode ==='BANKED' || this.candidateDetails.statuscode ==='FAKE'){
      this.router.navigate(['/candidates/dashboard'])
    }else{
      this.navigateToPersonalDetailsPage(this.candidateDetails.statuscode);
    }
    this.onAccept();
  }
  
  navigateToPersonalDetailsPage(statuscode?){
    if(statuscode === 'ITECHINT' || statuscode === 'IITECHINT' || statuscode === '3TECHINT' || statuscode === '4TECHINT' || statuscode === '5TECHINT'){
      this.checkInterviewDetails(statuscode);
    }else if(statuscode === 'OFFER'){
      this.checkSalaryDetails(statuscode)
    }
    else{
      this.router.navigate(['/candidates/job-profile/'+ CANDIDATE_JOB_PROFILE_PATH_LIST[statuscode]])
    }
  }

  checkSalaryDetails(statuscode?){
    let input ={
      "input": {
        "company":"WT",
        "resumeNumber":[this.candidateDetails.resumeNumber.toString()]
      }
    }
    this.candidateService.getSalaryDetails(input).subscribe(
      (res) =>{
        this.successCheckSalaryDetails(res.output, statuscode)
      },
    error => {this.errorHandler(error)}
  );
  }
  successCheckSalaryDetails(output:any, statuscode){
    if(output.status === 'failure'){
      this.router.navigate(['/candidates/job-profile/fitment'])
    }else{
      if(output && output.list1){
        this.salaryDetails = output.list1[0];
      }
      // this.router.navigate(['/candidates/job-profile/' + CANDIDATE_JOB_PROFILE_PATH_LIST[statuscode]])
    }
  }


  checkInterviewDetails(statuscode?): any {
    let input = {
      "input": {
        "feature": "INTERVIEW_DETAILS","company": "WT",
        "multiple": [
          {
            "filter0": this.candidateDetails.resumeNumber.toString()
          }
        ]
      }
    }
    this.candidateService.getInterviewDetails(input).subscribe(response =>{      
      this.CheckSuccessInterviewDetails(response.output,statuscode)
    },
    error => { this.errorHandler(error) }
    )
  }

  CheckSuccessInterviewDetails(output:any, statuscode?){
    if(output.status === 'failure' ||( output.list1 !== undefined && output.list1.length == 0)){
      this.router.navigate(['/candidates/job-profile/business-interview'])
    }else{
      this.router.navigate(['/candidates/job-profile/' + CANDIDATE_JOB_PROFILE_PATH_LIST[statuscode]])
    }
  }

  // getSalaryDetails(){
  //   let input ={
  //     "input": {
  //       "company":"WT",
  //       "resumeNumber":[this.candidateDetails.resumeNumber.toString()]
  //     }
  //   }
  //   this.candidateService.getSalaryDetails(input).subscribe(
  //     (res) =>{
  //       this.onSuccessSalaryDetails(res.output)
  //     },
  //   error => {this.errorHandler(error)}
  // );
  // }

  onSuccessSalaryDetails(output){
    this.loading = false;
    if(output.status === 'failure'){
      // this.toastr.error(output.message, '', {
      //   closeButton: true
      // });
      this.alertService.success(output.message);
      this.failureMessage = output.message;
    }else if(output &&output.list1){
      this.salaryDetails = output.list1[0];
    }
    
  }

  successCandidateDetails(output){
    if(output && output.list1){
      this.candidateDetails = output.list1[0];
    }
    // this.getSalaryDetails();
  }


  errorHandler(error){
    this.loading = false; 
    console.log(error);
  }

  onAccept(){
    let status = 'ACCEPT'
    this.updateOfferStatus(status,this.AcceptComments)
  }

  onDecline(){
    this.message = ''
    this.hasError = false;
    if(this.commentsForm.invalid){
      this.message = "Comment can't be blank";
      this.hasError = true;
      return
    }
    let comment = this.commentsForm.value.comments;
    let status = 'REJECT'
    this.updateOfferStatus(status, comment)
  }

  onSeekClarification(){
    window.scroll(0,0);
    this.commonMethodsService.bodyUnscrollable();
    this.seekClarification = true;
  }

  cancel(){
    this.seekClarification = false;
    this.isDecline = false;
    this.commonMethodsService.bodyScrollable();    
  }

  submitSeekClarification(){
    this.message = ''
    this.hasError = false;
    if(this.commentsForm.invalid){
      this.message = "Comment can't be blank";
      this.hasError = true;
      return
    }
    let comment = this.commentsForm.value.comments;
    let status = 'CLARIFY'
    this.updateOfferStatus(status, comment)   
  }

  openDeclinePop(){
    window.scroll(0,0);
    this.commonMethodsService.bodyUnscrollable();
    this.isDecline = true;
  }

  createForm(){
    this.commentsForm = new FormGroup({
      comments: new FormControl('', Validators.required),
    });
  }

  setMonthlyGross(monthlyGross){
    if(monthlyGross.componentDescription==='Monthly Gross')
      this.monthlyGross = monthlyGross;
  }

  updateOfferStatus(status?:any, comments?:any){
    this.loading = true;
    let offerStatusInput = {
      "input": {
        "feature": "updateSalaryAccept",
        "company": "WT",
        "inputs": [
          {
            "resumeNumber": this.candidateDetails.resumeNumber.toString(),
            "offerStatus":status,
            "comments":comments
          }
        ]
      }
    }
    
    this.candidateService.updateOfferStatus(offerStatusInput).subscribe(res=>{
      this.commentsForm.reset('');
      this.successUpdateOfferStatus(res);
      if( res.output.status === 'success'){
        this.alertService.success(res.output.message);
      }      
      if(res.status == 'success' || res.output.message ==="success" ){
        if(status === 'ACCEPT'){
          this.acceptedOffer = true;
        }
        this.cancel();
        let auth = this.changePasswordService.getAuth();
        if(auth){
          let input = {
            "input": {
              "feature": "CANDIDATE_DETAILS","company": "WT",
              "multiple": [
                {
                  "filter0": auth.ResumeNumber.toString()
                  // "filter0" : "547781"
                }
              ]
            }
          }
          this.candidateService.getCandidateDetails(input).subscribe(response =>{
            this.successCandidateDetails(response.output)
            if(status === 'ACCEPT'){
              this.acceptedOffer = true;
            }
            if(status === 'REJECT' && res.status == 'success'){
              this.router.navigate(['/candidates/job-profile/fitment'])
            }
          },
          error => { this.errorHandler(error) }
          )
        }
      }
    },error => { this.errorHandler(error)}
  );
  }

  successUpdateOfferStatus(response){
    // this.loading = false;
    this.seekClarification = false;
    this.commonMethodsService.bodyScrollable();
  }
}
