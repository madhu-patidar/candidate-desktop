import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../services/candidate.service';
import { JobDetailsService } from '../../recommended-job/job-details.service';
import { CommonMethodsService } from '../../services/common-method.service';
import { Candidate } from '../../candidate.model';
import { Router } from '@angular/router';
import { AlertPopService } from '../../../shared/components/alert-pop/alert-pop.service';

@Component({
  selector: 'app-job-profile-header',
  templateUrl: './job-profile-header.component.html',
  styleUrls: ['./job-profile-header.component.css']
})
export class JobProfileHeaderComponent implements OnInit {

  message: any;
  hasError: boolean;
  failureMessage: void;
  candidate: Candidate;
  interviewDetails: any;
  applyNowConfirmation:boolean = false;

  constructor(
    private candidateService : CandidateService,
    private jobDetailsService : JobDetailsService,
    private commonMethodsService : CommonMethodsService,
    private router: Router,
    private alertService : AlertPopService
  ) { }


  ngOnInit() {
    this.getInterviewDetails()
  }


  getInterviewDetails(): any {
    this.candidate  = this.candidateService.getCurrentCandidate();
  }

  errorHandler(error){
    console.log(error.error.message)
  }

  withdrawApplication(){
    this.commonMethodsService.bodyUnscrollable();
    this.applyNowConfirmation = true;
  }

  onConfirmWithdrawApplication(){
    let input = {
      "input": {
        "feature": "reassignJobcode",
        "company": "WT",
        "inputs": [
          {
            // "resumeNumber": "547935",
            "resumeNumber": this.candidate.resumeNumber.toString(),
            "newJobcode": "0"
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
    if(response.output !== undefined && response.output.status === 'failure'){
      // this.hasError = true;
      // this.message = response.output.message;
      this.alertService.error(response.output.message);
      this.applyNowConfirmation = false;
    }else{
      this.alertService.success(response.output.message);
      let input = {
        "input": {
          "feature": "CANDIDATE_DETAILS","company": "WT",
          "multiple": [
            {
              "filter0":this.candidate.resumeNumber.toString()
            }
          ]
        }
      }
      this.candidateService.getCandidateDetails(input).subscribe(response =>{
        setTimeout( ()=> {
          // this.candidateService.sendCandidate(response.output.list1[0])
        }, 300)
        this.commonMethodsService.bodyScrollable()
        this.applyNowConfirmation = false;

        this.router.navigate(['/candidates/dashboard'])
      },
      error => { this.errorHandler(error) }
      )
    }
  }

  closePop(){
    this.commonMethodsService.bodyScrollable()
    this.applyNowConfirmation = false;
    this.hasError = false;
  }

}
