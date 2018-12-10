import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, } from '@angular/common/http';
import { HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';

import { 
  PATTERN_LOADING_DATA_URL, ENTITY_SAVE_URL, FINAL_SUBMISSION_URL
 } from './../../apis.constant'

@Injectable()
export class PatternDataService {

  patternData:any;

  headers;

  constructor(
    private http : HttpClient,
  ) {
    this.headers = new HttpHeaders()
    .set('Username', 'MTAwMDE=')
    .set('Password', 'd2lwcm9AMTIz')
    .set('Content-Type', 'application/json')
   }
   
   getFreshPatterData(resumeNumber){
    this.getPatternData(resumeNumber).subscribe();
   }

  getPatternData(resumeNumber) { 
    let response : any;

    //TO DO ME
    let input = {"inputs" :
      {
      "resumeNumber": resumeNumber.toString(), 
      // "resumeNumber": "548080", 
      // "resumeNumber": "547785", 
       // let resume =  "547277"; 547785
    //  "resumeNumber": "503028", 
      // "resumeNumber": "8093562", 
      // "resumeNumber": "545437", 
      // let  resumeNumber = "547781",//547276 
      "companyCode": "WT", 
      "moduleType": "lateral"
      }
    }
     return this.http.post(PATTERN_LOADING_DATA_URL, input, {headers: 
       this.headers})
     .map(res => {
       response = res
       this.onSuccess(response)
         return response
     });
   }

  onSuccess(res:any){
   
    if(JSON.stringify(res.output) !== "{}"){
      this.patternData = res.output;
      localStorage.setItem('patternData', JSON.stringify(res.output));
    }
    
   }

   entitySave(inputData){
    let response : any;
    return this.http.post(ENTITY_SAVE_URL, inputData, {headers: 
      this.headers})
      .map(res => {
        response = res
          return response
      });
   }

   finalSubmission(inputData){
    let response : any;
    return this.http.post(FINAL_SUBMISSION_URL, inputData, {headers: 
      this.headers})
      .map(res => {
        response = res
          return response
      });
   }

   getEntityData(displayId: string){
    let patternData = JSON.parse(localStorage.getItem('patternData'));

    let entity: any;
    if(patternData !== null){
      // patternData.displayEntity.forEach(element => {
      //   if(element.displayId == displayId){
      //     entity = element;
      //   }
      // });
      for (let index = 0; index < patternData.displayEntity.length; index++) {
        if( patternData.displayEntity[index].displayId == displayId){
          entity = patternData.displayEntity[index];
          entity['index'] = index;
        }
      }
    }
    return entity;
  }

  getAccountDetails(){
    let patternData = JSON.parse(localStorage.getItem('patternData'));
    let accountDetails: any;
    if(patternData !== null){
      accountDetails = patternData.accountDetails
    }
    return accountDetails;
  }

  getPersonalDetails(){
    let patternData = JSON.parse(localStorage.getItem('patternData'));
    let personalDetails: any;
    if(patternData !== null){
      personalDetails = patternData.personalDetails
    }
    return personalDetails;
  }
}
