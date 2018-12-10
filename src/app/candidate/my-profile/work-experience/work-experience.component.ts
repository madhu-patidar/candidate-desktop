import { Component, Input, OnInit, ViewChild }  from '@angular/core';
import { FormGroup, Validators, FormControl }   from '@angular/forms';

import { PatternDataService } from '../../services/pattern-data.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
 
import { EntityBase }              from '../../../shared/dynamic-form/entity-base';
import { EntityControlService }    from '../../../shared/dynamic-form/entity-control.service';
import { EntityService } from '../../../shared/dynamic-form/entity.service';
import { CandidateService } from '../../services/candidate.service';
import { PersonalDetails } from '../personal-details/personal-details.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MyProfileService } from '../my-profile.service';
import { EventEmitter } from '@angular/core';
import { LOA_DOCUMENT_UPLOAD_URL } from '../../../apis.constant';
import { DOCUMENT_FORMAT_LIST } from '../my-profile.constant';
import { CommetTextAreaComponent } from '../commet-text-area/commet-text-area.component';
import * as moment from 'moment';
import { AlertPopService } from '../../../shared/components/alert-pop/alert-pop.service';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.css']
})
export class WorkExperienceComponent implements OnInit {

  uploadedDocumentCategory: any = [];
  isEntityDisabled: boolean = true;
  entityDataId: any;
  sequenceIds: any;
  errorMessage: string;
  isFormInvalid: boolean;
  displayId: string;
  displayNameList: any = [];
  entityIds: any = [];
  workExperienceForm: FormGroup;
  dur: any = [];
  durationDetails: any = [];
  accountDetails: any;
  personalDetails: PersonalDetails;
  input:any;
  subEntityDetailsForm: FormGroup;
  moreEntities: EntityBase<any>[];
  showAddMoreWorkExperience: boolean;
  subEntityDetails: any;
  subEntityExistingDetails: any = [];
  payLoad:any;
  loading:boolean = false;
  candidate:any;
  formList = [];
  entityDetails:any
  displayName: string = '';
  entitiesList = [];
  date:any = new Date()
  selfEmploymentFormShow : boolean = false;

  //file uploadin variable declration 
  options: UploaderOptions = { concurrency: 1, maxUploads: 100 };
  optionsForDocumnet: UploaderOptions = { concurrency:1, maxUploads: 100 };
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  filesForDocumnet: UploadFile[];
  uploadInputForDocumnet: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  isDocumentUpload : boolean = false;

  filesNameArray = [];
  fileDetailsList = [];
  @ViewChild(CommetTextAreaComponent) commetTextArea:CommetTextAreaComponent;
  entityNotAvailable: boolean;
  filesArray: any = [];
  maxDate: string;
  screenNumber: any;
  selfEmploymentForm: FormGroup;
  selfEmpDetails: any;

  constructor
  (
    private ecs: EntityControlService,
    private service: EntityService,
    private patternDataService : PatternDataService,
    private candidateService : CandidateService,
    private datePipe : DatePipe,
    private router : Router,
    private myProfileService : MyProfileService,
    private alertPopService: AlertPopService,
  ) {

    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this. entityIds = [];
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.filesForDocumnet = [];
    this.uploadInputForDocumnet = new EventEmitter<UploadInput>();
  }
 
  ngOnInit() {
    this.getCandidate();    
  }

  selectFromDate: boolean = false;
  selectToDate: boolean = false;
  onChangeDate(index?, lable?, date?, dateFrom?){

    if(lable === 'fromDate' && dateFrom === 'addMoreFromDate'){
      this.selectFromDate = true;
    }
    if(lable === 'toDate' && dateFrom === 'addMoreToDate'){
      this.selectToDate = true;
    }

    if(index > this.durationDetails.length){
      this.durationDetails[index] = {'comments': '-'};
    }
    this.durationDetails[index][lable] =  this.datePipe.transform(date, 'dd-LLL-yyyy');
    // console.log(this.duration)
  }
 
  getCandidate(){
    this.candidate = this.candidateService.getCurrentCandidate();
    this.setWorkExperience()

  }

  NavigateToNext(){
    this.router.navigate(['/candidates/my-profile/address-check'])
  }

  setWorkExperience(){
    this.accountDetails = this.patternDataService.getAccountDetails();
    this.personalDetails = this.patternDataService.getPersonalDetails();
    this.displayId = 'DIS2';
    let entity: any = this.patternDataService.getEntityData(this.displayId);
    if(!entity){
      this.NavigateToNext();
      return;
    }
    this.screenNumber = entity.index + 2;
    this.displayName = entity.displayName;
    this.entityDetails =  entity.entityDetails

    if((this.personalDetails.bgv1_sub_status === 'SEEKCAND' || this.personalDetails.bgv2_sub_status === 'SEEKCAND' ) && entity.entityDataStatus === 'SEEKCAND'){
      this.isEntityDisabled = false;
    }

   
    if(entity.entityDetails.length == 2 ){
      this.selfEmpDetails = entity.entityDetails[1].selfEmpDetails
      this.subEntityDetails = entity.entityDetails[1].SubEntityDetails
    }else{
      this.selfEmpDetails = entity.entityDetails[0].selfEmpDetails
      this.subEntityDetails = entity.entityDetails[0].SubEntityDetails
    }

    if(entity.entityDetails){
      entity.entityDetails.forEach(element => {
        if(element.entityId && this.entityIds){
          this.entityIds.push(element.entityId)
        } 
        if(element.durationDetails !== undefined && element.durationDetails.length > 0){
          this.durationDetails.push(element.durationDetails.sort((a, b) => a.sequenceId - b.sequenceId));  
        }
        if(element.uploadedDocumentCategory !== undefined && element.uploadedDocumentCategory.length > 0)
        {
          this.uploadedDocumentCategory.push(element.fileDetails);
        }
      });
      this.setDuration(this.durationDetails);
    }

    this.listOfForm();
    if(this.entityDetails !== undefined){
      this.entityDetails.forEach(element => {
        if(element.subEntityExistingDetails){
          element.subEntityExistingDetails.forEach(e => {
            this.subEntityExistingDetails.push(e)
          });
          this.setEntities(element.subEntityExistingDetails);
        }
        
      });
    }

    if(this.uploadedDocumentCategory){
      this.setFilesName();
    }

    this.createForm();

    if(this.selfEmpDetails && this.selfEmpDetails.length > 0){
      this.onSelectSelfEmployement('Y');
    }

    
   // Get Input 
   this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, Array.from(new Set(this.entityIds)).toString(), this.displayName,'enFlag');
    
    // this.addMoreWorkExperience()
  }

  removeExisingFile(index, index1){
    this.filesArray.push(this.fileDetailsList[index][index1].fileId)
    delete this.filesNameArray[index][index1]
  }

  setFilesName(){
    let j = 1
    let filesNameArray = []
    let fileDetailsList = []
    for (let i = 0; i < this.formList.length; i++) {
      filesNameArray[i] = [];
      fileDetailsList[i] = []
    }
    for (let index = 0; index < this.uploadedDocumentCategory.length; index++) {
      for (let i = 0; i < this.uploadedDocumentCategory[index].length; i++) {
        fileDetailsList[index].push(this.uploadedDocumentCategory[index][i])
        j++;
      }
    }
    this.fileDetailsList = fileDetailsList;

    for (let index = 0; index < fileDetailsList.length; index++) {
      let file =  this.fileDetailsList[index]
        for (let i = 0; i < file.length; i++) {
          let f = file[i];
          for (let j = 0; j < f.length; j++) {
            filesNameArray[index].push(f[j].fileName)
          }
        }
    }
    // filesNameArray[index].push(this.uploadedDocumentCategory[index][i].fileName);
    console.log('filesNameArray', filesNameArray)

    this.filesNameArray = filesNameArray

    console.log('fileDetailsList', this.fileDetailsList)
    console.log('filesNameArray', this.filesNameArray)
  }

  onSelectSelfEmployement(value){
    this.selfEmploymentFormShow = value === "Y" ? true : false; 
  }
  createForm(){
    let hasSelfEmpDetails = this.selfEmpDetails && this.selfEmpDetails.length > 0
    this.workExperienceForm = new FormGroup({
      workExp: new FormControl(this.personalDetails.workExp, [Validators.required, Validators.min(1)] ),
      relevantWorkExp: new FormControl(this.personalDetails.relevantWorkExp, [Validators.required, Validators.min(1)]),
      selfEmployment: new FormControl({
        value :hasSelfEmpDetails ? 'Y' : 'N', disabled : this.isEntityDisabled
      }),
    });

   

    if(hasSelfEmpDetails){
      this.workExperienceForm.patchValue({
        selfEmployment : 'Y'
      })
    }
    let selfEmpDetails = this.selfEmpDetails[0];
    
    this.selfEmploymentForm = new FormGroup({
      accountantAddress: new FormControl({value: hasSelfEmpDetails && JSON.stringify(selfEmpDetails.accountantAddress) !== '{}' ? selfEmpDetails.accountantAddress : '', disabled : this.isEntityDisabled }, Validators.required),
      accountantContactNumber: new FormControl({value: hasSelfEmpDetails && JSON.stringify(selfEmpDetails.accountantContact) !== '{}' ? selfEmpDetails.accountantContact : '', disabled : this.isEntityDisabled }, Validators.required),
      accountantEmailId: new FormControl({value: hasSelfEmpDetails && JSON.stringify(selfEmpDetails.accountantEmail) !== '{}' ? selfEmpDetails.accountantEmail : '', disabled : this.isEntityDisabled }, Validators.required),
      accountantName: new FormControl({value: hasSelfEmpDetails && JSON.stringify(selfEmpDetails.accountantName) !== '{}' ? selfEmpDetails.accountantName : '', disabled : this.isEntityDisabled }, Validators.required),
      companyName: new FormControl({value: hasSelfEmpDetails && JSON.stringify(selfEmpDetails.companyName) !== '{}' ? selfEmpDetails.companyName : '', disabled : this.isEntityDisabled }, Validators.required),
      positionHeld: new FormControl({value: hasSelfEmpDetails && JSON.stringify(selfEmpDetails.designation) !== '{}' ? selfEmpDetails.designation : '', disabled : this.isEntityDisabled }, Validators.required),
    });


  }

  setDuration(duration?){
    let durationDetails = []
    for (let i = 0; i < this.subEntityExistingDetails.length; i++) {
      durationDetails[i] = {};
    }
    let j = 0
    if(duration && duration.length > 0){
      duration.forEach(element => {
        if(element && element.length){
          for (let index = 0; index < element.length; index++) {
            durationDetails[j] = {"fromDate" : this.datePipe.transform(element[index].fromDate),"toDate" : this.datePipe.transform(element[index].toDate),"comments":"-"};
            // this.duration[index-1][lable] = this.datePipe.transform(date, 'dd-LLL-yyyy');
            j++;
          }
        }
      });
    }

    console.log('durationDetails',this.durationDetails)
    console.log('durationDetails',j)
      // for (let index = 0; index < duration.length; index++) {
      //     durationDetails[duration[index].sequenceId- 1] = {"fromDate" : duration[index].fromDate,"toDate" : duration[index].toDate,"comments":"-"};
        
      // }
      this.durationDetails = durationDetails
  }

  listOfForm(){
    if(this.entityDetails){
      this.entityDetails.forEach(e =>{
        if(e.subEntityExistingDetails !== undefined){
          e.subEntityExistingDetails.forEach(entities =>{
            // this.entityIds.push(e.entityId.toString());
            this.displayNameList.push(e.displayName);
            this.formList.push( this.ecs.toFormGroup(this.service.getEntities(entities),this.isEntityDisabled))
          })
        }
      })
    }
  }

  addMoreWorkExperience(){
    this.durationDetails[this.durationDetails.length]  = {'comments': '-'};
    this.showAddMoreWorkExperience = true
    this.moreEntities = this.service.getEntities(this.subEntityDetails);
    this.subEntityDetailsForm = this.ecs.toFormGroup(this.moreEntities);
  }

  removeAddedWorkExperience(){
    this.durationDetails.splice(-1,1)
    this.showAddMoreWorkExperience = false;
    this.moreEntities = undefined;
    this.subEntityDetailsForm = undefined;
  }


  isInvalid(){
    let validation:boolean = false
    this.formList.forEach(form => {
      if(form.invalid){
        validation = true;
      }
    });
    if(this.showAddMoreWorkExperience && (this.subEntityDetailsForm.invalid || !this.selectFromDate || !this.selectToDate)){
      validation = true;
    }
    return validation
  }

  onSubmit(status?: any) {

    if(this.durationDetails){
      //check To and From date validation for seekcand entity
      if(this.isEntityDisabled){
        let d = this.durationDetails[this.durationDetails.length-1]
        if( d && d.length > 0 && (moment(d['toDate']) < moment(d['fromDate']))){
          this.alertPopService.error("To Date should be greater than From Date");
          return
        }
         //check To and From date validation for non-SEEKCAND entity
      }else{
        for (let index = 0; index < this.durationDetails.length; index++) {
          let d = this.durationDetails[index];
          if( index === this.durationDetails.length-1 && d && d.length >0 && (moment(d['toDate']) < moment(d['fromDate']))){
            this.alertPopService.error("To Date should be greater than From Date");
            return
          } 
        }
      }
    }
    // console.log("this.entityIds",this.entityIds);
    this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, Array.from(new Set(this.entityIds)).toString(), this.displayName,'enFlag');
    
    // this.onfilesSubmit()
    this.isFormInvalid = false;
    if(this.isInvalid()){
      this.alertPopService.error('Please fill all the fields marked with *')
      return false;
    }
    if(this.workExperienceForm.invalid){
      this.alertPopService.error('Total work experience & Relavent work experience should be a non-zero number');
      // this.message = "Total work experience & Relavent work experience should be a non-zero number"
      // this.isFormInvalid = true;
      return false;
    }
    this.loading = true;
    if(this.formList === undefined || (this.formList !== undefined && this.formList .length === 0)){
      this.input.inputs.subEntityDetails[0].subEntity[0] = []
    }
  // this.input.inputs.subEntityDetails.entityId = Array.from(new Set(this.entityIds)).toString();

  this.input.inputs.workExp =  this.workExperienceForm.value.workExp.toString();
  this.input.inputs.relWorkExp =  this.workExperienceForm.value.relevantWorkExp.toString();
  this.input.inputs.selfEmployment =  this.workExperienceForm.value.selfEmployment;

  if(this.input.inputs.selfEmployment === "Y"){
    this.input.inputs.selfEmpArr.push(this.selfEmploymentForm.value);
  }

    let values = []
      for (let i = 0; i < this.formList.length; i++) {
        let keys  = Object.keys(this.formList[i].value)
       this.input.inputs.subEntityDetails[0].subEntity[i] = []
        for (let j = 0; j < keys.length; j++) {
          if(j==0 && this.durationDetails && ((this.showAddMoreWorkExperience && this.durationDetails.length > 1) || (!this.showAddMoreWorkExperience && this.durationDetails.length > 0) )){// check for added more experience or not 
            if(this.durationDetails[i]){
              this.input.inputs.subEntityDetails[0].subEntity[i].push(this.durationDetails[i]);
            }else{
              this.input.inputs.subEntityDetails[0].subEntity[i].push({});
            }
           
          }
         this.input.inputs.subEntityDetails[0].subEntity[i].push({'dynamic':this.formList[i].value[keys[j]], 'subId': keys[j]});
        }
      }
    // this.payLoad = this.input.inputs
    if(this.showAddMoreWorkExperience){
      let keys  = Object.keys(this.subEntityDetailsForm.value)
      // console.log(keys)
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length] = []
      for (let j = 0; j < keys.length; j++) {
        if(j==0 && this.durationDetails !==undefined && this.durationDetails.length > 0){
          this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push(this.durationDetails[this.durationDetails.length-1]);
        }
        this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'dynamic':this.subEntityDetailsForm.value[keys[j]], 'subId': keys[j]});
      }
      // this.payLoad = this.input.inputs;
    }

    for (let index = 0; index < this.input.inputs.subEntityDetails[0].subEntity.length; index++) {
      if(this.input.inputs.subEntityDetails[0].subEntity[index].length === 0){
        this.input.inputs.subEntityDetails[0].subEntity.splice(index, 1);
      }  
    }

    if(!this.isEntityDisabled){
      this.commetTextArea.commentFormValue()
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'clarificationComments':this.commetTextArea.commentFormValue()});
    }
    this.input.inputs.fileArray = this.filesArray;
    this.patternDataService.entitySave(this.input).subscribe(res =>{
      this.loading = false;
      this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds, this.displayName,'enFlag');      
      if(res.status =='failure'){
      // this.message = res.message;
      // this.showSuccessMessage = true;
      this.alertPopService.error(res.message);
      }else if(res.status == "success"){
        this.sequenceIds = res.sequenceNumbers;
        this.entityDataId = res.entityDataIds;
        if(status == 'Save' && res.status == "success" && res.message == "SUCCESS"){
          this.alertPopService.success(res.Message)
        }
        this.startUploaded();
        this.patternDataService.getPatternData(this.candidate.resumeNumber.toString()).subscribe(
          response => {
            if(status == 'Save & Next' && res.status == "success" && res.message == "SUCCESS"){
              this.router.navigate(['/candidates/my-profile/address-check'])
            }
          }
        )
      }
    })
  }

  getEntities(subEntityExistingDetail){
    return this.service.getEntities(subEntityExistingDetail)
  }

  setEntities(entityDetails?){
    if(entityDetails){
      entityDetails.forEach(element => {
          this.entitiesList.push(this.service.getEntities(element)) 
      });
    }
  }

  onUploadOutput(output: UploadOutput, fileDetails): void {
    if(output && output.file && output.file.type && DOCUMENT_FORMAT_LIST.indexOf(output.file.type) == 1){
    }
    let entityDataId = this.subEntityExistingDetails && this.subEntityExistingDetails.length > 0 ? this.subEntityExistingDetails[0][0].entityDataId.toString() : "";
    if(output.type == 'start')
      this.loading = true;
    if(output.type == 'done'){
      this.loading = false;
    }  
    if(output.type == 'rejected')
      this.files[0] = output.file;

    if(output.type === 'allAddedToQueue' && output.file == undefined && this.files[0]){
      let sequenceId = fileDetails !== undefined && fileDetails.sequenceId !== undefined ? fileDetails.sequenceId.toString() : ""
      const event: any = {
        type: 'uploadAll',
        url: LOA_DOCUMENT_UPLOAD_URL,
        method: 'POST',
        data: {file: this.files[0], companyCode:'WT',moduleType:'lateral',fileName: this.files[0].name ,userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId:entityDataId, sequenceNo:sequenceId, finalReportUpload:false,page:'Y' }
      };
      // this.uploadingFileList.push(event);
      this.uploadInput.emit(event)
    }
    if ((output.type === 'allAddedToQueue' || output.type === 'addedToQueue' ) && output.file !== undefined ) { 
      let sequenceId = fileDetails !== undefined && fileDetails.sequenceId !== undefined ? fileDetails.sequenceId.toString() : ""
      const event: any = {
        type: 'uploadAll',
        url: LOA_DOCUMENT_UPLOAD_URL,
        method: 'POST',
        data: {file: output.file, companyCode:'WT',moduleType:'lateral',fileName: output.file.name ,userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId:entityDataId, sequenceNo:sequenceId, finalReportUpload:false,page:'Y' }
      };
      // this.uploadingFileList.push(event);      
      this.uploadInput.emit(event); 
    }
  }


  documentUploaded(output: UploadOutput, fileDetails?): void {
    let flag = 0;
    if(output && output.file){

    }
    this.isDocumentUpload = true;
    if(output.type === 'start')
    this.loading = true
    if(output.type === 'done'){
      this.loading = false;
    }
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      // this.filesForDocumnet.push(output.file);
      if(output.file && this.filesForDocumnet && this.filesForDocumnet.length>0)
      this.filesForDocumnet.forEach(file =>{
        if(file.name === output.file.name && file.size === output.file.size){
          flag = 1
        }
      })
      if(flag === 0){
        this.filesForDocumnet.push(output.file);
      }
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      // this.filesForDocumnet.push(output.file);
      if(output.file && this.filesForDocumnet && this.filesForDocumnet.length>0)
      this.filesForDocumnet.forEach(file =>{
        if(file.name === output.file.name && file.size === output.file.size){
          flag = 1
        }
      })
      if(flag === 0){
        this.filesForDocumnet.push(output.file);
      }
      // this.filesForDocumnet[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in filesForDocumnet array for uploading file
      const index = this.filesForDocumnet.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesForDocumnet[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.filesForDocumnet = this.filesForDocumnet.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  removeFile(id: string, index): void {
    this.uploadInputForDocumnet.emit({ type: 'remove', id: id });
  }
  startUploaded(){
    if(this.filesForDocumnet && this.filesForDocumnet.length > 0){
      for (let index = 0; index < this.filesForDocumnet.length; index++) {
        const event: UploadInput = {
          type: 'uploadFile',
          url: LOA_DOCUMENT_UPLOAD_URL,
          method: 'POST',
          file :this.filesForDocumnet[index] ,
          data: {companyCode:'WT',moduleType:'lateral',
          userId:this.personalDetails.resumeNumber.toString(), fileName: this.filesForDocumnet[index].name + (index+1).toString(), subSequenceNo: (index+1).toString(), resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId: this.entityDataId[0], sequenceNo:this.sequenceIds[this.sequenceIds.length-1], finalReportUpload:'false',page:'Y' },
          };
        this.uploadInputForDocumnet.emit(event);  
       }
    } 
  }
}
