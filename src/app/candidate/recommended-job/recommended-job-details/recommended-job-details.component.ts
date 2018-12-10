import { Component, OnInit, TemplateRef } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { JobDetailsService } from './../job-details.service';
import { CommonMethodsService } from './../../services/common-method.service';
import { CandidateService } from '../../services/candidate.service';
import { AfterContentChecked } from '@angular/core';
import { AfterContentInit } from '@angular/core';

declare function viewSharedLink(vHandler, sJobCode, jobTitle) : any 

@Component({
  selector: 'app-recommended-job-details',
  templateUrl: './recommended-job-details.component.html',
  styleUrls: ['./recommended-job-details.component.css'],
  providers: [JobDetailsService]
})
export class RecommendedJobDetailsComponent implements OnInit {

  hasSuccess: boolean;
  jobDetailsError: boolean;
  hasError: boolean = false;
  message: string = "";
  loading: boolean;
  applyNowConfirmation:boolean = false;
  jobCode:any;
  jobDetails:any;
  candidateDetails:any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobDetailsService : JobDetailsService,
    private commonMethodsService : CommonMethodsService,
    private candidateService : CandidateService
  ) { }

  ngOnInit() {
    this.getCandidate()
    const id = this.route.snapshot.paramMap.get('id');
    this.jobCode = id;
    if(this.jobCode !== null && this.jobCode !== undefined && this.jobCode != this.candidateDetails.jobCode ){
      // this.getJobDetails(632418)
      this.getJobDetails(this.jobCode)
      
    }
  }


  navigateSamePage(event){
    this.jobCode = event.jobCode;
    this.getJobDetails(this.jobCode)
    // this.getJobDetails('632418')
  }


  getCandidate(){
    this.candidateDetails = this.candidateService.getCurrentCandidate();
  }


  getJobDetails(jobCode?){
    this.jobDetailsError = false;
    this.jobDetailsService.getJobDetails(jobCode).subscribe(
      res =>{ this.succuessGetJobDetails(res)},
      error =>{this.errorHandler(error)}
    )
  }


  succuessGetJobDetails(response){
  if(response.output.message !== undefined && response.output.message === 'Invalid Job Code')
  {
    this.jobDetails = undefined;
    this.jobDetailsError = true;
    this.message = 'Invalid Job Code';
  }
  if(response && response.output && response.output.message === undefined)
      this.jobDetails = response.output;
  }

  showApplyNowConfirmationModal(){
    this.commonMethodsService.bodyUnscrollable();
    window.scroll(0,0);
    this.applyNowConfirmation = true;
  }

  hideApplyNowConfirmationModal(){
    this.commonMethodsService.bodyScrollable()
    this.applyNowConfirmation = false;
  }

  applyConfirmed(){
    this.loading = true;
    let input = {
      "input": {
        "feature": "reassignJobcode",
        "company": "WT",
        "inputs": [
          {
            "resumeNumber":this.candidateDetails.resumeNumber.toString(),
            "newJobcode": this.jobCode.toString()
          }
        ]
      }
    }

    this.jobDetailsService.JobApply(input).subscribe(
      res => {this.onAppliedSuccess(res)},
      error => {this.errorHandler(error)}
    )
  }

  onAppliedSuccess(response){
    this.loading = false;
    this.commonMethodsService.bodyScrollable()
    this.applyNowConfirmation = false;
    if(response.output.status !== 'failure'){
      this.message = response.output.message;
      this.hasSuccess = true;
      // this.router.navigate(['/candidates/dashboard'])
    }else{
      this.commonMethodsService.bodyUnscrollable();
      this.message = response.message;
      this.hasError = true;
    }
     
  }

  navigateToDashboard(){
    this.loading = true;
    let input = {
      "input": {
        "feature": "CANDIDATE_DETAILS","company": "WT",
        "multiple": [
          {
            "filter0":this.candidateDetails.resumeNumber.toString()
          }
        ]
      }
    }
    this.candidateService.getCandidateDetails(input).subscribe(response =>{
      if(response.output && response.status === 'success'){
        this.commonMethodsService.bodyScrollable();
        this.hasSuccess = false;
        this.loading = false;
        setTimeout( ()=> {
          // this.candidateService.sendCandidate(response.output.list1[0])
        }, 300)
        this.router.navigate(['/candidates/dashboard'])
      }

      error => { this.errorHandler(error) }
    });
  }
     

  cancel(){
    this.commonMethodsService.bodyScrollable();
    this.message = "";
    this.hasError = false;
  }
  getCandidateDetails(){
    this.candidateDetails = this.candidateService.getCurrentCandidate();
  }

  errorHandler(error){
    console.log(error.error);
  }

  shareJob(vHandler){
    let jobTitle = ''
    if(this.jobCode == this.candidateDetails.jobCode){
      jobTitle = this.candidateDetails.jobTitle;
    }else{
      jobTitle = this.jobDetails.jobTitle
    }
    let sJobCode = this.jobCode;
    viewSharedLink(vHandler, sJobCode, jobTitle)
  }



}
