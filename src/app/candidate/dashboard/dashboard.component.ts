import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';

import { CandidateService } from './../services/candidate.service';
import { SocialNetworksService } from './../services/social-networks.service';
import { CommonMethodsService } from './../services/common-method.service';
import { Candidate } from './../candidate.model';

import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ChangePasswordService } from '../change-password/change-password.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AlertPopService } from '../../shared/components/alert-pop/alert-pop.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [SocialNetworksService, ChangePasswordService],
})
export class DashboardComponent implements OnInit {
  subscription:Subscription;
  
  message: any;
  noReferred: boolean;
  candidateDetails: Candidate;
  referredMessage : boolean = false;
  iframeUrl : any;
  showIframe : boolean = false;
  jobCode;
  loading: boolean = false;

  constructor(
    private candidateService : CandidateService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private commonMethodsService : CommonMethodsService,
    private toastr: ToastrService,
    private changePasswordService : ChangePasswordService,
    private alertService : AlertPopService
  ) { }
  
  ngOnInit(){
    this.subscription = this.candidateService.candidate$.subscribe((candidate) => {
      if (candidate) {
        this.candidateDetails = candidate;
      }
    });
    this.getCandidateDetails();
  }

  // TO DO ME
  getCandidateDetails(){
    this.candidateDetails = this.candidateService.getCurrentCandidate();
    this.checkSourceConfirmFlag(this.candidateDetails)
  }

  // getCandidateDetails(){
  //   let auth = this.changePasswordService.getAuth();
  //   if(auth){
  //     let input = {
  //       "input": {
  //         "feature": "CANDIDATE_DETAILS","company": "WT",
  //         "multiple": [
  //           {
  //             "filter0": auth.ResumeNumber.toString()
  //             // "filter0" : "547277"
  //           }
  //         ]
  //       }
  //     }
  //     this.candidateService.getCandidateDetails(input).subscribe(response =>{
  //       this.successCandidateDetails(response.output)
  //     },
  //     error => { this.errorHandler(error) }
  //     )
  //   }
  // }

  successCandidateDetails(output){
    if(output['status'] === 'failure'){
      // this.message = output.message
      this.alertService.error(output.message);
    }else{
      this.candidateDetails = output.list1[0];
      this.checkSourceConfirmFlag(this.candidateDetails)
    }

  }

  onNoReferred(){
    this.noReferred = true;
  }

  cancelReferrePop(){
    this.noReferred = false;
  }



  checkSourceConfirmFlag(candidateDetails){
    let sourceConfirmation = JSON.parse(localStorage.getItem('sourceConfirmation'));
    if(sourceConfirmation === null && candidateDetails.sourceConfirmFlag === 'N'){
      this.commonMethodsService.bodyUnscrollable();
      this.referredMessage = true;
    }
  }

  onNoSourceConfirmation(){
    this.commonMethodsService.bodyScrollable();
    this.noReferred = false;
    this.referredMessage = false;
    // localStorage.setItem('sourceConfirmation', JSON.stringify({'confirm':true}));
    this.sourceConfirmation("N");
  }
  sourceConfirmation(value?:any){
  //  let input = {
  //   "input": {
  //     "feature": "submitReferralDetails",
  //     "company": "WT",
  //     "inputs": [
  //       {
  //         "resumeNumber": this.candidateDetails.resumeNumber.toString(),
  //         "jobcode": this.candidateDetails.jobCode.toString(),
  //         "referrerName" : this.candidateDetails.subSource,
  //         "referrerEmailId" : this.candidateDetails.candEmalId,
  //         "source" : this.candidateDetails.source,
  //       }
  //     ]
  //   }
  // }
  let input = {
    "input": {
      "feature": "sourceConfirmUpdate",
      "company": "WT",
      "inputs": [  
        {  
          "resumeNumber": this.candidateDetails.resumeNumber.toString(),
          "panNumber" : "",
          "sourceConfirmedFlag": value
        }
  
      ]
  
    }
  
  }
    this.candidateService.sourceConfirmation(input).subscribe(response =>{
      this.successSourceConfirmation(response)
    },
    error => { this.errorHandler(error) }
    )
  }

  successSourceConfirmation(response){
    if(response.output && response.output['status'] === 'failure'){
      // this.message = output.message
      // this.toastr.error(response.output.message, '', {
      //   closeButton: true
      // });
      this.alertService.error(response.output.message);
    }else{
      // this.toastr.success(response.output.message, '', {
      //   closeButton: true
      // });
      this.alertService.success(response.output.message);
      localStorage.setItem('sourceConfirmation', JSON.stringify({'confirm':true}));
    }
    this.commonMethodsService.bodyScrollable();
    this.referredMessage = false;
    this.noReferred = false;

  }

  cancel(){
    this.commonMethodsService.bodyScrollable();
    this.referredMessage = false;
    localStorage.setItem('sourceConfirmation', JSON.stringify({'confirm':true}));
  }

  errorHandler(error){
    this.loading = false;
    console.log(error)
  }

  navigateToPendingTask(){
    this.router.navigate(['/candidates/do-it-yourself'])
  }

  navigateToScreen(){
    this.router.navigate(['/candidates/job-profile/to-screen'])
  }

  navigateRecommendedJobDetails(){
    if(this.candidateDetails !== undefined && this.candidateDetails.jobCode !== undefined )
      this.router.navigate(['/candidates/recommended-job-details/'+ this.candidateDetails.jobCode])   
  }

  navigateToMyProfile(){
    this.router.navigate(['/candidates/my-profile'])
  }
  playVideo(url:string){
    this.commonMethodsService.bodyUnscrollable();
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.showIframe = true;
  }

  hideIfram(){
    this.commonMethodsService.bodyScrollable();
    this.showIframe = false;
  }

  dateFormat(date){
    return moment(date).format('MMMM DD');
  }
}
