import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, } from '@angular/common/http';
import { HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';

import { 
  CANDIDATE_DETIALS_URL,
  INERVIEW_DETIALS_URL,
  NOTIFICATIONS_URL,
  INERVIEW_SUBMISSION_URL,
  SOURCE_CONFIRMATION_URL,
  SALARY_DETAILS,
  APPLY_JOB,
  UPDATE_SALARY_OFFER_STATUS,
  PENDING_TASK_URL
 } from './../../apis.constant'

import { environment } from './../../../environments/environment';
import { ChangePasswordService } from '../change-password/change-password.service';

@Injectable()
export class CandidateService {
  
  candidateAPIURL:string = environment.baseUrl;
  headers;
  interviewDetails:any;
  candidateDetails;
  loading:boolean = true;
  
  constructor(
    private http : HttpClient,
    private changePasswordService : ChangePasswordService, 
    private router : Router
  ) {
    this.headers = new HttpHeaders()
    .set('Username', 'MTAwMDE=')
    .set('Password', 'd2lwcm9AMTIz')
    .set('Content-Type', 'application/json')
   }

  setCurrentCandidate(candidate){
    localStorage.setItem("candidate", JSON.stringify(candidate));
  }

  getCurrentCandidate(){
    let candidate = JSON.parse(localStorage.getItem("candidate"))
    if(candidate !== null){
      return candidate;
    }
  }

  getFreshCandidateDetails(resumeNumber) { 
    let input = {
      "input": {
        "feature": "CANDIDATE_DETAILS","company": "WT",
        "multiple": [
          {          
            "filter0": resumeNumber.toString()
          }
        ]
      }
    }
    this.getCandidateDetails(input).subscribe( res => {
      return res.output.list1[0]
    })
   }
 

  getCandidateDetails(candidateData) { 
   let response : any;
    return this.http.post(CANDIDATE_DETIALS_URL, candidateData, {headers: 
      this.headers})
    .map(res => {
      response = res;
      if(response.output.status !== "failure"){
        this.candidateDetails = response.output.list1[0];
        this.setCurrentCandidate( this.candidateDetails);
      }

        return response
    });
  }

  getNotificationDetails(candidateData) {
    let response : any;
    return this.http.post(NOTIFICATIONS_URL, candidateData, {headers: 
      this.headers})
    .map(res => {
      response = res
        return response
    });
  }

  getInterviewDetails(candidateData) {
    let response : any;
    return this.http.post(INERVIEW_DETIALS_URL, candidateData, {headers: 
      this.headers})
    .map(res => {
      response = res
      this.setInterviewDetails(response);
      return response
    });
  }

  pendingTask(input){
    let response : any;
    return this.http.post(PENDING_TASK_URL, input, {headers: 
      this.headers})
    .map(res => {
      response = res
      return response
    });
  }

  setInterviewDetails(response:any){
    // this.interviewDetails = response.output.list1[0];
  }

  sourceConfirmation(candidateData) {
    this.headers = new HttpHeaders()
    .set('Username', 'MTAwMDE=')
    .set('Password', 'd2lwcm9AMTIz')
    .set('Content-Type', 'application/json')
    let response : any;
    return this.http.post(SOURCE_CONFIRMATION_URL, candidateData, {headers: 
      this.headers})
    .map(res => {
      response = res
        return response
    });
  }

  interviewSubmission(candidateData) {
    let response : any;
    return this.http.post(INERVIEW_SUBMISSION_URL, candidateData, {headers: 
      this.headers})
    .map(res => {
      response = res
        return response
    });
  }


  candidateName(){
    if(this.candidateDetails !== undefined){
      return this.candidateDetails.candName;
    }else{
      return "sachin"
    }
  }

  getSalaryDetails(candidateData){
    this.headers = new HttpHeaders()
    .set('Username', 'Mzg2MQ==')
    .set('Password', 'Mzg2MQ==')
    .set('Content-Type', 'application/json')
    let response : any;
    return this.http.post(SALARY_DETAILS, candidateData, {headers: 
      this.headers})
    .map(res => {
      response = res
        return response
    });
  }

 updateOfferStatus(input){
  let response : any;
  return this.http.post(UPDATE_SALARY_OFFER_STATUS, input, {headers: 
    this.headers})
  .map(res => {
    response = res
      return response
  });
 }

}
