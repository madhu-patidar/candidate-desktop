import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { FileUploadService } from '../../services/file-upload.service';
import { CandidateService } from './../../services/candidate.service';
import { PatternDataService } from '../../services/pattern-data.service';
import { CommonMethodsService } from '../../services/common-method.service';


import { PersonalDetails } from './personal-details.model'


import * as moment from 'moment';
import { Router } from '@angular/router';
import { GET_PHOTO_URL } from '../../../apis.constant';
import { DatePipe } from '@angular/common';
import { AlertPopService } from '../../../shared/components/alert-pop/alert-pop.service';


@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
 
  hasError: boolean;
  isFormInvalid: boolean;
  message: string;
  showSuccessMessage: boolean;
  successMesaage: string;
  personalDetailsInput:any;
  accountDetails: any;
  file: File;
  date: string;
  selectedMaritalStatus: any;
  selectedGender: any;
  masterMarritalStatusList: any;
  personalDetails: PersonalDetails;
  uploadPhotoPop: boolean = false;
  rejectedPhotoGraphPop: boolean = false;
  selfDeclarationPopOpen: boolean = false;
  voluntaryEelfDeclarationPop : boolean = false;
  personalDetailsForm: FormGroup;
  masterGenderList:any;
  countyList:any
  loading:boolean = false;
  disabilitiesArray :any;
  photos:any
  resumeNumber:any;

  fileUpload: any
  uploadFiles: string = "No file choosen"
  files: any
  input: any
  label: any
  numFiles: any
  imageUrl:any
  profilePicUrl = GET_PHOTO_URL + 'WT/lateral/';
  displayName = 'Personal Details'

  @ViewChild('radio') radio: ElementRef;
  candidate: any;
  maxDate: string;
  
  constructor(
    private sanitizer: DomSanitizer,
    private candidateService : CandidateService,
    private fileUploadService : FileUploadService,
    private patternDataService : PatternDataService,
    private router: Router,
    private commonMethodsService : CommonMethodsService,
    private datePipe : DatePipe,
    private alertPopService: AlertPopService,
  ) { 
    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.createForm();
  }

  ngOnInit() {
    this.loading = true;
    this.getPersonalDetails();
    
  }

  getPersonalDetails(){
    this.candidate = this.candidateService.getCurrentCandidate();
    this.personalDetails = this.patternDataService.getPersonalDetails();
    this.accountDetails = this.patternDataService.getAccountDetails();
    // if(this.personalDetails.bgv1_sub_status === "SAVED" || this.personalDetails.bgv2_sub_status === "SAVED"){
    //   this.router.navigate(['/candidates/my-profile/loa'])
    // }
    this.setPersonalDetails()
    
  }

  setPersonalDetails(){
    if(this.personalDetails !== undefined){
      this.setInput(this.personalDetails);
      this.masterGenderList = this.personalDetails.masterGenderList;
      this.countyList = this.personalDetails.countyList;
      this.masterMarritalStatusList = this.personalDetails.masterMarritalStatusList
      this.populatedFormValues(this.personalDetails);
    }
    this.loading = false;
  }

  openUploadPhotoPop(){
    window.scroll(0,0);
    this.commonMethodsService.bodyUnscrollable(); 
    this.uploadPhotoPop = true;
  }


  cancel(){
    this.commonMethodsService.bodyScrollable();
    this.uploadPhotoPop = false;
    this.rejectedPhotoGraphPop = false; 
    this.base64textString = undefined;
    this.uploadFiles = 'No file choosen';   
  }


  createForm(){
    this.personalDetailsForm = new FormGroup({
      resumeNumber: new FormControl({value: '', disabled: true}),
      skype_id: new FormControl(''),
      residentCountry: new FormControl(''),
      firstName: new FormControl({value: '', disabled: true}),
      lastName: new FormControl({value: '', disabled: true}),
      fathersName: new FormControl('', Validators.required),
      mailId: new FormControl({value: '', disabled: true}),
      contactNumber: new FormControl('', Validators.required),
      // gender: new FormControl(''),
      dob: new FormControl({value: '', disabled: true}),
      marital_status: new FormControl('', Validators.required),
      birthLocation: new FormControl(''),
    });
  }

  populatedFormValues(personalDetails){
    this.selectedGender = personalDetails.gender;
    // this.selectedResidentCountry = personalDetails.residentCountry;
    this.selectedMaritalStatus = personalDetails.marital_status;

    this.personalDetailsForm.patchValue({
      resumeNumber: personalDetails.resumeNumber,
      skype_id: personalDetails.skype_id,
      residentCountry: personalDetails.jobCountryCode,
      firstName: personalDetails.firstName,
      lastName: personalDetails.lastName,
      fathersName: personalDetails.fathersName,
      mailId: personalDetails.mailId,
      contactNumber: personalDetails.contactNumber,
      gender:personalDetails.gender,
      dob: personalDetails.dob,
      marital_status: personalDetails.marital_status,
      birthLocation: personalDetails.birthLocation,
    })

    this.date =personalDetails.dob;
  }

  openSelfDeclarationPop(){
    this.commonMethodsService.bodyUnscrollable();
    // this.radio.nativeElement.checked = true;
    window.scroll(0,0);
    this.selfDeclarationPopOpen = true;
  }

  OpenVoluntaryEelfDeclarationPop(){
    this.commonMethodsService.bodyUnscrollable();
    window.scroll(0,0);
    this.voluntaryEelfDeclarationPop = true;
  }

  popCancel(){
    this.commonMethodsService.bodyScrollable();
    this.rejectedPhotoGraphPop = false;  
    this.voluntaryEelfDeclarationPop = false;
    this.selfDeclarationPopOpen = false;
  }

  popDisplayNone(event){
    this.commonMethodsService.bodyScrollable();
    this.voluntaryEelfDeclarationPop = false;
  }

  
  selfDeclaration(event){
    this.commonMethodsService.bodyScrollable();
    this.selfDeclarationPopOpen = false;
    this.disabilitiesArray = event.disabilitiesArray
    this.selfDeclarationPopOpen = false;
    if(this.disabilitiesArray ===undefined || this.disabilitiesArray.lenght === 0){
      this.radio.nativeElement.checked = true;
    }
  }

  onSubmit(status){
    this.isFormInvalid = false;
    this.showSuccessMessage = false;
    if(this.personalDetailsForm.invalid){
      // this.message = "Please fill all te fields marked with *"
      // this.isFormInvalid = true;
      this.alertPopService.error("Please fill all te fields marked with *");
      return false;
    }
    this.loading = true;
    this.setInput(this.personalDetails);
    this.personalDetailsInput.inputs.mobileNumber = this.personalDetailsForm.value.contactNumber
    this.personalDetailsInput.inputs.gender = this.personalDetailsForm.value.gender;
    this.personalDetailsInput.inputs.fatherName = this.personalDetailsForm.value.fathersName;
    this.personalDetailsInput.inputs.maritalStatus = this.personalDetailsForm.value.marital_status;
    this.personalDetailsInput.inputs.countryCode = this.personalDetailsForm.value.residentCountry;
    this.personalDetailsInput.inputs.birthLocation = this.personalDetailsForm.value.birthLocation;
    this.personalDetailsInput.inputs.skypeId = this.personalDetailsForm.value.skype_id;
    this.patternDataService.entitySave(this.personalDetailsInput).subscribe(res =>{
      this.loading = false;
      this.patternDataService.getPatternData(this.candidate.resumeNumber.toString()).subscribe(
        response => {
      if(res.status == "success" && res.message == "SUCCESS"){
       
        if(status == 'Save' && res.status == "success" && res.message == "SUCCESS"){
          this.alertPopService.success(res.Message)
        }
        // this.patternDataService.getFreshPatterData(this.personalDetails.resumeNumber)
      }
      if(status == 'Save & Next' && res.status == "success" && res.message == "SUCCESS"){
        this.router.navigate(['/candidates/my-profile/education-details'])
      }
    })
    })
  }

  getProfilePic(){
    if(this.personalDetails !== undefined){
      return this.profilePicUrl 
      +  this.personalDetails.resumeNumber  + "?timestamp=" + this.fileUploadService.timestamp;
    }else return  'assets/images/profile-photo.png'
  }

  setInput(personalDetails?){
    this.personalDetailsInput = {
      "inputs":{
        "resumeNumber":personalDetails.resumeNumber.toString(),
        "companyCode":"WT",
        "userLevel":"12",
        "status":"SAVED",
        "moduleType":"lateral",
        "typeCheck":this.accountDetails.typeOfCheck,
        "userId":personalDetails.resumeNumber.toString(),
        "division":this.accountDetails.division,
        "subdivision":this.accountDetails.subdivision,
        "accountCode":this.accountDetails.accountCode,
        "location":personalDetails.locationCode.toString(),
        "countryCode":"IND",
        "workCompy":personalDetails.workedCompanies.toString(),
        "submittedValue":"Save",
        "entityName":"",
        "maritalStatus":"M",
        "fatherName":"test",
        "birthLocation":"-",
        "emailId":personalDetails.mailId.toString(),
        "mobileNumber":personalDetails.contactNumber,
        "skypeId":"-",
        "DOB":this.datePipe.transform(personalDetails.dob, 'dd-MM-yyyy'),
        "subEntityDetails":[],
        "gapDetails":[],
        "bgv1Status":JSON.stringify(personalDetails.bgv1_sub_status) ==='' || JSON.stringify(personalDetails.bgv1_sub_status) ==='{}' ? 'SAVED' : personalDetails.bgv1_sub_status,
            "bgv2Status":JSON.stringify(personalDetails.bgv2_sub_status) ==='' || JSON.stringify(personalDetails.bgv2_sub_status) ==='{}' ? 'SAVED' : personalDetails.bgv2_sub_status,
        "workExp": personalDetails.workExp.toString(),
        "relWorkExp":personalDetails.relevantWorkExp.toString(),
      }
    }
    
  }

  /**
   *  upload profile 
   */
  onPhotoSubmit(){
    if(!this.file){
      this.hasError = true;
      this.message = 'Please choose the Photograph !!'
      return;
    }

    if(this.file.type !== 'image/jpeg'){
      this.hasError = true;
      this.message = 'Photograph should be in .jpeg format'
      return;
    }
    this.loading = true;
    let sizeinbytes = this.file.size;
    if(sizeinbytes < 30*1024 || sizeinbytes > 2*1024*1024){
      this.hasError = true;
      this.message = 'Photograph file size should be greater than 30KB and less than 2MB'
      return;
    }
    this.commonMethodsService.bodyScrollable();
    if(this.personalDetails !== undefined){
      this.fileUploadService.imageUpload(this.file, this.personalDetails)
      .subscribe(
        response => this.onImageUploadSuccess(response),
        error => this.errorHandler(error)
      )
    }
  }

  onImageUploadSuccess(response){
    if(response.status === 'success' && response.message === 'SUCCESS'){
      this.cancel();
      this.loading = false;
      this.fileUploadService.timestamp = new Date().getTime();
    }if(response.status === 'failure'){
      this.uploadPhotoPop = false;
      this.rejectedPhotoGraphPop = true;
    }
  }
  base64textString;
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           this.base64textString= btoa(binaryString);
           this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl( 'data:image/jpg;base64,' +btoa(binaryString));
   }


  fileEvent(event){
    this.input = event
    var files = event.target.files;
    if(files[0].type !== 'image/jpeg'){
      this.hasError = true;
      this.message = 'Photograph should be in .jpeg format'
      return;
    }
    var file = files[0];
    if (files && file) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
    this.hasError = false;
    this.numFiles = this.input.currentTarget.files.length
    this.file = this.input.currentTarget.files[0]
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.input.currentTarget.value);
    this.label = this.input.currentTarget.value.replace(/^.*[\\\/]/, '');
    if(this.numFiles === 0){
      this.uploadFiles = 'No file choosen'
    } else if(this.numFiles > 1 && this.numFiles !== 0){
        this.uploadFiles = this.numFiles + ' files'
    } else {
        this.uploadFiles = this.label
    }
  }

  errorHandler(error){
    this.loading = false;
    console.log(error)
  }
  
}

function readBase64(file) {
  var reader  = new FileReader();
  var future = new Promise((resolve, reject) => {
    reader.addEventListener("load", function () {
      resolve(reader.result);
    }, false);

    reader.addEventListener("error", function (event) {
      reject(event);
    }, false);

    // reader.readAsDataURL(file);
    console.log( reader.readAsDataURL(file))
  });
}