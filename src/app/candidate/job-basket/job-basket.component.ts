import { Component, OnInit } from '@angular/core';

import { JobDetailsService } from './../recommended-job/job-details.service';
import { CandidateService } from '../services/candidate.service';
import { AppliedJob, ReferralJob } from './job-basket.model';

@Component({
  selector: 'app-job-basket',
  templateUrl: './job-basket.component.html',
  styleUrls: ['./job-basket.component.css'],
  providers: [JobDetailsService]
})
export class JobBasketComponent implements OnInit {

  appliedJobsMessage: any;
  referralJobsMessage: any;
  appliedJobsList: AppliedJob[] = [];
  referralJobsList:ReferralJob[] = [];
  candidate:any;
  constructor(
    private jobDetailsService : JobDetailsService,
    private candidateService : CandidateService
  ) { }

  ngOnInit() {
    this.getCandidate();
    this.getAppliedJobs();
    this.getRefferalJobs();
  }

  getCandidate(){
    this.candidate = this.candidateService.getCurrentCandidate();
  }

  getAppliedJobs(){
    let input = {
      "input": {
        "feature": "APPLIED_JOBS",                                       
        "company": "WT",
        "multiple": [
          {
            // "filter0": "544463"
            "filter0": this.candidate.resumeNumber.toString()
          }
        ]
      }
    }
    this.jobDetailsService.appliedJobs(input).subscribe(res =>
      { this.onSuccessAppliedJobs(res)},
      error => {this.errorHandler(error)})
  }

  onSuccessAppliedJobs(res){
    if(res.output.status === 'failure'){
      this.appliedJobsMessage = res.output.message
    }else{
      this.appliedJobsList = res.output.list1
    }
  }

  getRefferalJobs(){
    let input = {
      "input": {
        "feature": "REFERRAL_DETAILS",                                       
        "company": "WT",
        "multiple": [
          {
            // "filter0" : this.candidate.resumeNumber.toString()
            "filter0" : this.candidate.candEmalId
            // "filter0": "santuchan@gmail.com"
          }
        ]
      }
    }
    this.jobDetailsService.refferalJobs(input).subscribe(res =>
      { this.onSuccessRefferalJobs(res)},
      error => {this.errorHandler(error)})
  }

  onSuccessRefferalJobs(res){
    if(res.output.status === 'failure'){
      this.referralJobsMessage = res.output.message
    }else{
      this.referralJobsList = res.output.list1
    }
  }

  errorHandler(error){

  }

}
