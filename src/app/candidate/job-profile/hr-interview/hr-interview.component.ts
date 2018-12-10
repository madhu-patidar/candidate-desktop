import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CandidateService } from './../../services/candidate.service'
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { CommonMethodsService } from './../../services/common-method.service';
import { ChangePasswordService } from '../../change-password/change-password.service';
import { CANDIDATE_JOB_PROFILE_PATH_LIST, DISABLITIES_LIST } from '../job-profile.constant';

import * as _ from "lodash";
import { AlertPopService } from '../../../shared/components/alert-pop/alert-pop.service';

declare function initialize(address) : any


@Component({
  selector: 'app-hr-interview',
  templateUrl: './hr-interview.component.html',
  styleUrls: ['./hr-interview.component.css']
})
export class HRInterviewComponent implements OnInit {

  message: string;
  candidate: any;
  failureMessage: any;
  disabilityList: string = '';
  commentsForm: FormGroup;
  disabilitiesArray: any = [];
  comments: any;
  interviewNewDate: any;
  interviewNewTime: any;
  interviewDetails: any;
  newTimeSlotShow : boolean = false;
  declineMessage : boolean = false;
  confirmMessage : boolean = false;
  finalSlotSelected : boolean = false;
  GatepassAvailable : boolean = false;
  submitted : boolean = false;
  differentInterviewSlot : boolean = false;
  declinedTimeslot : boolean = false;
  gatepassPending : boolean = false;
  specialAssistanceDeclaration : boolean = false;
  loading:boolean = false;
  selectInterviewNewTime;
  selectInterviewNewDate;
  candDisabilitiesArray : any = [];

  @ViewChild('radio') radio: ElementRef;
  disabilities: string[];
  noRedioButtoChecked: any;

  constructor(
      private router: Router,
      private candidateService: CandidateService,
      private commonMethodsService : CommonMethodsService,
      private alertService : AlertPopService
    ) { 
      this.disabilities = DISABLITIES_LIST;
    }

  ngOnInit() {
    this.candidate = this.candidateService.getCurrentCandidate();
    this.createForm();
    if(this.candidate.jobCode === 0 || this.candidate.jobCode === '0' || this.candidate.statuscode ==='INSAP' || this.candidate.statuscode ==='BANKED' || this.candidate.statuscode ==='FAKE'){
      this.router.navigate(['/candidates/dashboard'])
    }else{
      this.navigateToPersonalDetailsPage(this.candidate.statuscode);
    }
  }


  navigateToPersonalDetailsPage(statuscode?){
    if(statuscode === 'HRINT' || statuscode === '2HRINT'){
      this.getInterviewDetails();
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
      this.router.navigate(['/candidates/job-profile/business-interview'])
    }else{
      this.loading = false;
      if(output && output.list1){
        this.interviewDetails = output.list1[0];
        if (_.intersection(this.disabilities, this.interviewDetails.specialAssistDeclaration.split(',')).length > 0)
        this.disabilitiesArray =  this.interviewDetails.specialAssistDeclaration.split(',');
        this.selectInterviewNewTime =  this.interviewDetails.interviewTime1;
        this.selectInterviewNewDate = this.interviewDetails.interviewDate1; 
        if(this.interviewDetails.interviewStatus == 'ACCEPT'){
          this.submitted = true;
          this.declinedTimeslot = false;
          this.finalSlotSelected = true;
        }
        setTimeout(()=>{ 
          initialize(this.interviewDetails.interviewVenue)
      }, 500);
        // initialize(this.interviewDetails.interviewVenue)
      }
    }
  }

  hasBlank(value?: string, value2?: string){
    return  value.trim() === "" && value2.trim() === "";
  }

  getInterviewDetails(): any {
    this.loading = true;
    let input = {
      "input": {
        "feature": "INTERVIEW_DETAILS",                                                       "company": "WT",
        "multiple": [
          {
            'filter0' : this.candidate.resumeNumber.toString()
            // "filter0": "547781"
          }
        ]
      }
    }
    this.candidateService.getInterviewDetails(input).subscribe(response =>{
      this.successInterviewDetails(response)
    },
    error => { this.errorHandler(error) }
    )
  }

  successInterviewDetails(response:any){
    this.loading = false;
    if(response.status === 'success' && response.output.list1){
      this.interviewDetails = response.output.list1[0];
      if (_.intersection(this.disabilities, this.interviewDetails.specialAssistDeclaration.split(',')).length > 0){
        this.disabilitiesArray =  this.interviewDetails.specialAssistDeclaration.split(',');
        this.candDisabilitiesArray =  JSON.parse(JSON.stringify(this.interviewDetails.specialAssistDeclaration.split(',')));
      }
      
      this.selectInterviewNewTime =  this.interviewDetails.interviewTime1;
      this.selectInterviewNewDate = this.interviewDetails.interviewDate1;
     
      if(this.interviewDetails.interviewStatus == 'ACCEPT'){
        this.submitted = true;
        this.declinedTimeslot = false;
        this.finalSlotSelected = true;
      }
      setTimeout(()=>{ 
          initialize(this.interviewDetails.interviewVenue)
      }, 500);
      // initialize(this.interviewDetails.interviewVenue)
    }else if(response.output.status === 'failure'){
      this.message = 'Your resume is shortlisted, HR Interview will be scheduled.'
    }
  }

  errorHandler(error){
    this.loading = false;
    console.log(error)
  }

  sourceConfirmation(): any {
    let input ={
      "input": {
        "feature": "SOU_SUBMISSION","company": "WT",
        "inputs": [
          {
            "resumeNumber": this.interviewDetails.resumeNumber.toString(),
            // "panNumber": "23456788"
          }
        ]
      }
    }
    this.candidateService.sourceConfirmation(input).subscribe(response =>{
      this.successSourceConfirmation(response.output)
    },
    error => { this.errorHandler(error) }
    )
  }

  successSourceConfirmation(response:any){
  }

  onOk(){
    window.scroll(0,0);
    this.commonMethodsService.bodyUnscrollable();
    this.submitted = true;
    this.declinedTimeslot = false;
    // this.finalSlotSelected = ! this.finalSlotSelected;
    this.confirmMessage  = !this.confirmMessage;
  }

  cancle(){
    this.commonMethodsService.bodyScrollable();
    this.newTimeSlotShow = false;
    this.declineMessage = false;
    this.confirmMessage = false;
    this.finalSlotSelected = false;
    this.GatepassAvailable = false;
    this.submitted = false;
    this.differentInterviewSlot = false;
    this.specialAssistanceDeclaration = false;
    this.radio.nativeElement.checked = true;
    this.noRedioButtoChecked = true;
    this.disabilitiesArray = this.candDisabilitiesArray;
    // this.router.navigate(['/candidates/job-profile/interview-schedule-details'])
  }

  declaredSpecialAssistance(result){
    this.disabilityList = "";
    this.commonMethodsService.bodyScrollable();
    this.disabilitiesArray = result.disabilitiesArray
    this.specialAssistanceDeclaration = false;
    if(this.disabilitiesArray === undefined || result.disabilitiesArray.length === 0){
      this.radio.nativeElement.checked = true;
      this.noRedioButtoChecked = true;
      this.disabilitiesArray = this.candDisabilitiesArray;
    }
    if(this.disabilitiesArray !== undefined && this.disabilitiesArray.length > 0 ){
      this.disabilityList = this.disabilitiesArray.toString();
    }
  }

  noDisabilities(){
    this.noRedioButtoChecked = this.radio.nativeElement.checked;
    this.disabilitiesArray = this.candDisabilitiesArray;
  }

  submitSpecialAssistanceDeclaration(){
    this.specialAssistanceDeclaration = false;
    
  }

  onSpecialAssistanceDeclaration(){
    this.noRedioButtoChecked = this.radio.nativeElement.checked;
    this.commonMethodsService.bodyUnscrollable();
    this.specialAssistanceDeclaration = !this.specialAssistanceDeclaration
    window.scroll(0,0);
  }

  onDecline(){
    this.commonMethodsService.bodyScrollable();
    this.declinedTimeslot = !this.declinedTimeslot;
    this.declineMessage = !this.declineMessage;
  }

  onInterviewDetailsSubmitted(interviewStatus?){
    this.loading = true;
    let specialAssistDeclaration : string = 'N'
    if(this.disabilitiesArray !== undefined && this.disabilitiesArray.length > 0 && !this.radio.nativeElement.checked ){
      specialAssistDeclaration = 'Y'
    }

    let input = {
      "input": {
        "feature": "submitInterviewDetails",
        "company": "WT",
        "inputs": [
          {
            "resumeNumber": this.interviewDetails.resumeNumber.toString(),    
            "interviewDate1":this.selectInterviewNewDate,
            "interviewTime1":this.selectInterviewNewTime,
            "interviewStatus":interviewStatus,
            "specialAssistDeclaration" : specialAssistDeclaration === 'Y' ? this.disabilityList : '',
            "specialAssistDeclareComments" :specialAssistDeclaration,
            "comments":this.comments
          }
        ]
      }
    }
    this.candidateService.interviewSubmission(input).subscribe(response =>{
      this.loading = false;
      // if(interviewStatus == 'ACCEPT'){
      //   this.differentInterviewSlot = false;
      //   this.finalSlotSelected = true;
      //   this.submitted = true;
      // }
      if(interviewStatus == 'DECLINE'){
        this.candidateService.getFreshCandidateDetails(this.interviewDetails.resumeNumber)        
        this.differentInterviewSlot = false;
        this.declinedTimeslot = true;
        this.commonMethodsService.bodyScrollable();
        if(response.output.status === 'success' && interviewStatus == 'ACCEPT'){
          this.alertService.success(response.output.message);
          this.differentInterviewSlot = false;
          this.finalSlotSelected = true;
          this.submitted = true;
          this.candidateService.getFreshCandidateDetails(this.interviewDetails.resumeNumber)
          // this.router.navigate(['/candidates/dashboard']);
        }
      }
        this.successInterviewSubmission(response.output)
      },
      error => { this.errorHandler(error) }
      ) 
  }

  decline(){
    this.commonMethodsService.bodyUnscrollable();    
    window.scroll(0,0);
    this.differentInterviewSlot = true;
  }

  onDateSelect(date){  
    this.selectInterviewNewDate = date;    
  }

  onDateSelectTime(time?){ 
    this.selectInterviewNewTime = time;
    
  }

  onNewTimeSlotSelected(){ 
    this.comments = this.commentsForm.value.comments
    this.onInterviewDetailsSubmitted('DECLINE');
  }

  successInterviewSubmission(output:any){
    if(output.status === 'failure'){
      // this.failureMessage = output.message
      this.alertService.error(output.message);
    }else{
      this.getCandidateDetails(this.interviewDetails.resumeNumber);
      this.submitted = true;
      this.declinedTimeslot = false;
      this.finalSlotSelected = ! this.finalSlotSelected;
    }
  }

  getCandidateDetails(resumeNumber){
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
    this.candidateService.getCandidateDetails(input).subscribe(response =>{
      this.successCandidateDetails(response.output)
    },
    error => { this.errorHandler(error) }
    )
  }

    successCandidateDetails(output){
      this.candidate = output.list1[0];
      this.getInterviewDetails();
    }

  createForm(){
    this.commentsForm = new FormGroup({
      comments: new FormControl('', Validators.required),
    });
  }

}
