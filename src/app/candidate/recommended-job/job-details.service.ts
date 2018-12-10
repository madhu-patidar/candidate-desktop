import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, } from '@angular/common/http';
import { HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';

import { 
  JOB_DETAILS_URL, APPLY_JOB,
   RECOMMENDED_JOBS_URL,
   APPLIED_JOB_URL,
   REFERRAL_JOB_URL
 } from './../../apis.constant'

@Injectable({
  providedIn: 'root'
})
export class JobDetailsService {
 
  headers;

  constructor(
    private http : HttpClient,
  ) {
    this.headers = new HttpHeaders()
    .set('Username', 'MTAwMDE=')
    .set('Password', 'd2lwcm9AMTIz')
    .set('Content-Type', 'application/json')
   }


  getJobDetails(jobCode) { 
    let response : any;
    let url = JOB_DETAILS_URL + 'comapnyCode=WT&Opr=getWalkInJobcodedetails&source=wiproCareerSite&jobcode='+jobCode
     return this.http.get(url, {headers: 
       this.headers})
     .map(res => {
       response = res;
         return response
     });
   }

   onSuccess(res:any){

   }

  JobApply(JaobDetails){
    let response : any;
    return this.http.post(APPLY_JOB, JaobDetails, {headers: 
      this.headers})
    .map(res => {
      response = res
        return response
    });
  }


  appliedJobs(JaobDetails){
    let response : any;
    return this.http.post(APPLIED_JOB_URL, JaobDetails, {headers: 
      this.headers})
    .map(res => {
      response = res
        return response
    });
  }


  refferalJobs(JaobDetails){
    let response : any;
    return this.http.post(REFERRAL_JOB_URL, JaobDetails, {headers: 
      this.headers})
    .map(res => {
      response = res
        return response
    });
  }

  getRecommendedJobs(inputData) { 
    let response : any;
     return this.http.post(RECOMMENDED_JOBS_URL, inputData, {headers: 
       this.headers})
     .map(res => {
       response = res
       this.onSuccess(response)
         return response
     });
   }
}
