import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../services/candidate.service';
import { Router } from '@angular/router';
import { Candidate } from './../candidate.model';

@Component({
  selector: 'app-do-it-yourself',
  templateUrl: './do-it-yourself.component.html',
  styleUrls: ['./do-it-yourself.component.css']
})
export class DoItYourselfComponent implements OnInit {

  statusList: any;
  failureMessage: any;
  pendingTaskList: any = [];
  candidateDetails: Candidate;
  pandingTask   = [];
  constructor(
    private candidateService : CandidateService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getCandidateDetails();
  }

  getCandidateDetails(){
    this.candidateDetails = this.candidateService.getCurrentCandidate();
    this.pendingTask();
    this.navigationStatusList();
  }

  navigationStatusList(){
    this.statusList = {
      'FILL_VD_DETAILS' : 'my-profile',
      'CLARIFY_VD_DETAILS' : 'my-profile',
      'SALARY_ACCEPT' : 'job-profile',
      'INTERVIEW_SLOT_ACCEPT' : 'job-profile',
      'ACCEPT_INTERVIEW' : 'job-profile',
      'ACCEPT_HR_INTERVIEW': 'job-profile',
    }
  }

  pendingTask(){
    let resumeNumber =  this.candidateDetails.resumeNumber;
    this.candidateService.pendingTask(resumeNumber) 
    .subscribe(
      res => {
        if(res.status == 'success' && res.output &&  res.output.list1){
          res.output.list1.map( (list:any) => {
            if(list.completed === 'N'){
              this.pandingTask.push(list.completed)
            }
          });
        }
        console.log(this.pandingTask)
      this.onSuccessPendingTask(res.output)}, 
      error => {this.errorHandler(error)}
    )
  }

  onSuccessPendingTask(output){
    if(output.status == 'failure')
      this.failureMessage = output.message
    else
      this.pendingTaskList = output.list1;
  }

  errorHandler(error){
    console.log(error)
  }

  navigateTo(pendingTask?){
    let status = pendingTask.sectionName
    this.router.navigate(['/candidates/'+ this.statusList[status]])
  }

  sectionName(sectionName){
    return sectionName.replace(/_/g," ")
  }


}
