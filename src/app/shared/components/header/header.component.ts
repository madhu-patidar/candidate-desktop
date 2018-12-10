import { Component, OnInit } from '@angular/core';

import { CandidateService } from './../../../candidate/services/candidate.service';

import { ShareMethodsService } from './../../services/share-methods.service';
import { Candidate, Notification } from './../../../candidate/candidate.model';
import { GET_PHOTO_URL, LOGIN_URL } from '../../../apis.constant';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { DoCheck } from '@angular/core';
import { FileUploadService } from '../../../candidate/services/file-upload.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [CandidateService]
})
export class HeaderComponent implements OnInit, OnDestroy {

  failureMessage: any;
  profileMenuToggle : boolean = false;
  notifactionsToggle : boolean = false;
  logout : boolean = false;
  candidateDetails : Candidate;
  notifications: Notification[] = [];
  loading:boolean = true;
  profilePicUrl : string =  GET_PHOTO_URL + 'WT/lateral/';

  subscription:Subscription;
  
  constructor(
    public candidateService : CandidateService,
    private shareMethodsService : ShareMethodsService,
    private fileUploadService : FileUploadService,
    @Inject(DOCUMENT) private document: any
    
  ) { }


  ngOnInit() {
    this.subscription = this.shareMethodsService.candidate$.subscribe((candidate) => {
      if (candidate) {
        this.candidateDetails = candidate;
      }
    });
    this.getCandidateDetails();
  }

  // ngDoCheck(){
  //   if(this.candidateService.getCurrentCandidate()){
  //     this.candidateDetails = this.candidateService.getCurrentCandidate();
  //   }

  // }

  getNotification(){
    let input = {
      "input": {
        "feature": "NOTIFICATION_DETAILS", "company": "WT",
        "multiple": [
          {
            // "filter0": ""
            "filter0": this.candidateDetails.resumeNumber.toString()
          }
        ]
      }
    }
    this.candidateService.getNotificationDetails(input).subscribe(response =>{
     let result = response.output.list1
     this.successGetNotification(response) 
    },
    error => { this.errorHandler(error) }
    )
  }

  getCandidateDetails(){
    this.candidateDetails = this.candidateService.getCurrentCandidate();
    if(this.candidateDetails !== undefined && this.candidateDetails !== null )
      this.getNotification();
  }

  errorHandler(error){
    console.log(error)
  }

  successGetNotification(response){
    if(response.output.status == 'failure')
      this.failureMessage =  response.output.message;
    else
      this.notifications = response.output.list1;
  }

  onClickMenu(){
    this.notifactionsToggle = false;
    this.profileMenuToggle = !this.profileMenuToggle
  }

  onNotifactionBall(){
    this.profileMenuToggle = false;
    this.notifactionsToggle = !this.notifactionsToggle
  }



  onLogout(){
    this.shareMethodsService.bodyUnscrollable();
    this.logout = true;
  }

  candidateLogout(){
    localStorage.clear();
    this.document.location.href = LOGIN_URL;
    // this.router.navigate(['auth/login'])
  }

  cancel(){
    this.shareMethodsService.bodyScrollable();
    this.logout = false;
  }

  clickOnLink(){
    this.profileMenuToggle = false;
    this.notifactionsToggle = false;
  }

  getProfilePic(){
    if(this.candidateDetails){
      return this.profilePicUrl 
      + this.candidateDetails.resumeNumber + "?timestamp=" + this.fileUploadService.timestamp;
      // + "547785" + "?timestamp=" + this.fileUploadService.timestamp;

    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }




}
