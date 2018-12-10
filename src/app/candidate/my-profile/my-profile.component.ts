import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { FileUploadService } from '../services/file-upload.service';
import { CandidateService } from './../services/candidate.service';
import { PatternDataService } from '../services/pattern-data.service';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit, OnDestroy {


  message: any;
  loading: boolean;
  date: string;
  selectedMaritalStatus: any;
  selectedGender: any;
  masterMarritalStatusList: any;
  persionalDetails: any;
  candidateDetails: any;
  uploadPhotoPop: boolean = false;
  rejectedPhotoGraphPop: boolean = false;
  personalDetailsForm: FormGroup;
  masterGenderList:any;
  countyList:any

  fileUpload: any
  uploadFiles: string = "No file choosen"
  files: any
  input: any
  label: any
  numFiles: any
  imageUrl:any

  constructor(
    private candidateService : CandidateService,
    private patternDataService : PatternDataService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.candidateDetails = this.candidateService.getCurrentCandidate()
    this.getPatternData(this.candidateDetails.resumeNumber);
  }

  getPatternData(resumeNumber?){
   let resume =  resumeNumber.toString() 
    this.patternDataService.getPatternData(resume).subscribe(response =>{
      this.successGetPatternData(response)
    },
    error => { this.errorHandler(error) }
    )
  }

  successGetPatternData(response:any){
    if(response.status === 'success'){
      if(response.output.Message !== undefined && response.output.Message === 'BGV already filled and submitted'){
        this.loading = false;
        this.message = response.output.Message;
      }else if(JSON.stringify(response.output) === "{}"){
        this.loading = false;
        this.router.navigate(['/not-found'])
      }else{
        this.storePatternData(response.output)
      }
    }else if(response.status === 'failure'){
      this.message = response.output.message;
    }
  } 

  /**
   * store data in session and redirect to profile screen
   * @param data 
   */
  storePatternData(data:any){
    localStorage.setItem('patternData', JSON.stringify(data));
    this.persionalDetails = data.personalDetails
    this.navigateToPersonalDetailsPage();
  }

  errorHandler(error){

  }

  navigateToPersonalDetailsPage(){
    this.loading = false;
    // if(this.persionalDetails.bgv1_sub_status === "SAVED" || this.persionalDetails.bgv2_sub_status === "SAVED"){
    //   this.router.navigate(['/candidates/my-profile/loa'])
    // }else{
      this.router.navigate(['/candidates/my-profile/personal-details'])
    // }
    
  }

  ngOnDestroy(){
    // localStorage.removeItem('patternData');
  }


}
