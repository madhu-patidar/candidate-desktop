import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Candidate } from '../../candidate.model';
import { CandidateService } from '../../services/candidate.service';
import { CANDIDATE_JOB_PROFILE_PATH_LIST } from '../job-profile.constant';

@Component({
  selector: 'app-not-shortlisted',
  templateUrl: './not-shortlisted.component.html',
  styleUrls: ['./not-shortlisted.component.css']
})
export class NotShortlistedComponent implements OnInit {

  candidate: Candidate;
  
  constructor(
    private router: Router,
    private candidateService: CandidateService
  ) { }

  ngOnInit() {
    this.candidate = this.candidateService.getCurrentCandidate();
    if(this.candidate.jobCode === 0 || this.candidate.jobCode === '0' || this.candidate.statuscode ==='INSAP' || this.candidate.statuscode ==='BANKED' || this.candidate.statuscode ==='FAKE'){
      this.router.navigate(['/candidates/dashboard'])
    }else{
      this.navigateToPersonalDetailsPage(this.candidate.statuscode);
    }
  }
  navigateToJobRecommended(){
    this.router.navigate(['/candidates/recommended-job-details'])
  }

  navigateToPersonalDetailsPage(statuscode?){
    if(statuscode === 'SCREENED'){

    }else if(statuscode === 'ITECHINT' || statuscode === 'IITECHINT' || statuscode === '3TECHINT' || statuscode === '4TECHINT' || statuscode === '5TECHINT'){
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
        "resumeNumber":[this.candidate.resumeNumber.toString()]
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
      console.log(output.message)
      this.router.navigate(['/candidates/job-profile/fitment'])
    }else{
      this.router.navigate(['/candidates/job-profile/' + CANDIDATE_JOB_PROFILE_PATH_LIST[statuscode]])
    }
  }


  checkInterviewDetails(statuscode?): any {
    let input = {
      "input": {
        "feature": "INTERVIEW_DETAILS","company": "WT",
        "multiple": [
          {
            "filter0": this.candidate.resumeNumber.toString()
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
      // this.router.navigate(['/candidates/job-profile/business-interview'])
    }else{
      this.router.navigate(['/candidates/job-profile/' + CANDIDATE_JOB_PROFILE_PATH_LIST[statuscode]])
    }
  }

  errorHandler(error){

  }

}
