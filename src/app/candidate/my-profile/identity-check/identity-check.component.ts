
import { Component, Input, OnInit, EventEmitter, ViewChild }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { PatternDataService } from '../../services/pattern-data.service';
 
import { EntityBase }              from '../../../shared/dynamic-form/entity-base';
import { EntityControlService }    from '../../../shared/dynamic-form/entity-control.service';
import { EntityService } from '../../../shared/dynamic-form/entity.service';
import { CandidateService } from '../../services/candidate.service';
import { PersonalDetails } from '../personal-details/personal-details.model';
import { DatePipe } from '@angular/common';
import { FileUploadService } from '../../services/file-upload.service';

import { Router } from '@angular/router';
import { MyProfileService } from '../my-profile.service';

import { CommetTextAreaComponent } from '../commet-text-area/commet-text-area.component';
import { LOA_DOCUMENT_UPLOAD_URL } from '../../../apis.constant';
import { AlertPopService } from '../../../shared/components/alert-pop/alert-pop.service';
@Component({
  selector: 'app-identity-check',
  templateUrl: './identity-check.component.html',
  styleUrls: ['./identity-check.component.css']
})
export class IdentityCheckComponent implements OnInit {

  
  isEntityDisabled: boolean = true;
  entityDataId: any;
  sequenceIds: any;
  showSuccessMessage: boolean;
  message: string;
  errorMessage: string;
  isFormInvalid: boolean;
  displayId: string;
  entityIds: any;
  accountDetails: any;
  fileUrl: any;
  uploadFiles: string;
  label: any;
  numFiles: any;
  documentCategory: any;
  subEntityDetailsForm: FormGroup;
  moreEntities: EntityBase<any>[];
  showAddMoreIdentityCheck: boolean;
  subEntityDetails: any;
  subEntityExistingDetails: any;
  payLoad:any;
  loading:boolean = false;
  candidate:any;
  formList = [];
  input:any;
  personalDetails: PersonalDetails
  displayName = '';
  durationDetails:any = [];
  uploadedDocumentCategory:any = [];
  duration: any = [];
  filesArray:any = [];
  entitiesList:any = [];
  filesNameArray:any = [];
  fileDetailsList :any
//file uploadin variable declration 
  options: UploaderOptions = { concurrency: 1, maxUploads: 100 };
  options1: UploaderOptions = { concurrency:1, maxUploads: 100 };
  formData: FormData;
  files: UploadFile[];
  filesForIdentities : UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  uploadInputForIdentities: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  @ViewChild(CommetTextAreaComponent) commetTextArea:CommetTextAreaComponent;
  entityNotAvailable: boolean;
  maxDate: string;
  screenNumber: any;
  
  constructor
  (
    private ecs: EntityControlService,
    private service: EntityService,
    private patternDataService : PatternDataService,
    private candidateService : CandidateService,
    private datePipe: DatePipe,
    private fileUploadService : FileUploadService,
    private router : Router,
    private myProfileService : MyProfileService,
    private alertPopService: AlertPopService,
  ) {
    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this. uploadInputForIdentities = new EventEmitter<UploadInput>();
    this.filesForIdentities = [];
    this.humanizeBytes = humanizeBytes;
  }
 
  ngOnInit() {
    this.getCandidate();
  }
 
  /**
   * get Candidate details from local storage then load Existing identity Details
   */
  getCandidate(){
    this.candidate = this.candidateService.getCurrentCandidate();
    this.setIdentityDetails();
  }

  NavigateToNext(){
    this.router.navigate(['/candidates/my-profile/database-check'])
  }

  setIdentityDetails(){
    this.accountDetails = this.patternDataService.getAccountDetails();
    this.personalDetails = this.patternDataService.getPersonalDetails();
    this.displayId = 'DIS8';
    let entity: any = this.patternDataService.getEntityData(this.displayId);

    if(!entity){
      this.NavigateToNext();
      return;
    }
    this.screenNumber = entity.index + 2;
    this.entityIds = entity.entityDetails.entityId;
    this.displayName = entity.displayName;  
    this.subEntityDetails = entity.entityDetails.SubEntityDetails;
    this.subEntityExistingDetails = entity.entityDetails.subEntityExistingDetails;
    if(!this.subEntityExistingDetails || (this.subEntityExistingDetails && this.subEntityExistingDetails.length === 0)){
      this.addIdentityCheck();
    }

    if((this.personalDetails.bgv1_sub_status === 'SEEKCAND' || this.personalDetails.bgv2_sub_status === 'SEEKCAND' ) && entity.entityDataStatus === 'SEEKCAND'){
      this.isEntityDisabled = false;
    }
    
    // this.durationDetails = entity.entityDetails.durationDetails.sort((a, b) => a.sequenceId - b.sequenceId);
    this.uploadedDocumentCategory = entity.entityDetails.fileDetails    ;
    this.documentCategory = entity.entityDetails.documentCategory;
    this.setFilesName();
    this.listOfForm();
    this.setEntities(this.subEntityExistingDetails);
    // Get Input 
    this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds,  this.displayName);
  }

  // setFilesName(){
  //   let j = 1
  //  if(this.uploadedDocumentCategory !== undefined){
  //     for (let index = 0; index < this.uploadedDocumentCategory.length; index++) {
  //       // for (let i = 0; i < this.uploadedDocumentCategory[index].length; i++) {
  //         this.filesNameArray.push(this.uploadedDocumentCategory[index].fileName);
  //         // j++;
  //       // }
  //     }
  //   }
  // }

  setFilesName(){
    let j = 1
    let filesNameArray = []
    let fileDetailsList = []
    if(this.subEntityExistingDetails){
      for (let i = 0; i < this.subEntityExistingDetails.length; i++) {
        filesNameArray[i] = [];
        fileDetailsList[i] = []
      }
    }

    if(this.uploadedDocumentCategory){
      for (let index = 0; index < this.uploadedDocumentCategory.length; index++) {
        for (let i = 0; i < this.uploadedDocumentCategory[index].length; i++) {
          filesNameArray[this.uploadedDocumentCategory[index][i].sequenceId-1].push(this.uploadedDocumentCategory[index][i].fileName);
         fileDetailsList[this.uploadedDocumentCategory[index][i].sequenceId-1].push(this.uploadedDocumentCategory[index][i])
          j++;
        }
      }
    }
    
    this.filesNameArray = filesNameArray
    this.fileDetailsList = fileDetailsList;
    console.log('this.fileDetailsList' ,this.filesNameArray)
    console.log('this.fileDetailsList', this.fileDetailsList)
  }

  listOfForm(){
    if(this.subEntityExistingDetails !== undefined){
      this.subEntityExistingDetails.forEach(entities =>{
        this.formList.push( this.ecs.toFormGroup(this.service.getEntities(entities), this.isEntityDisabled))
      })
    }
  }

  addIdentityCheck(){
    this.showAddMoreIdentityCheck = true
    this.moreEntities = this.service.getEntities(this.subEntityDetails);
    this.subEntityDetailsForm = this.ecs.toFormGroup(this.moreEntities);
  }

  RemoveIdentityCheck(){
    this.showAddMoreIdentityCheck = false;
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
    if(this.showAddMoreIdentityCheck && this.subEntityDetailsForm.invalid){
      validation = true;
    }
    return validation
  }

  onSubmit(status?: any) {

    // this.onfilesSubmit()
    this.isFormInvalid = false;
    if(this.isInvalid()){
      this.startUpload();
      // this.message = "Please fill all te fields marked with *"
      // this.isFormInvalid = true;
      this.alertPopService.error('Please fill all te fields marked with *');
      return false;
    }
    this.loading = true;
    if(this.formList === undefined || (this.formList !== undefined && this.formList .length === 0)){
      this.input.inputs.subEntityDetails[0].subEntity[0] = []
    }
    this.formList.forEach(form =>{
      let keys  = Object.keys(form.value)
      keys.forEach(key =>{
      })
      for (let i = 0; i < this.formList.length; i++) {
        let keys  = Object.keys(form.value)
        this.input.inputs.subEntityDetails[0].subEntity[i] = []
        for (let j = 0; j < keys.length; j++) {
          // if(j==0)
          // this.input.inputs.subEntityDetails[0].subEntity[i].push(this.duration[i]);
          this.input.inputs.subEntityDetails[0].subEntity[i].push({'dynamic':form.value[keys[j]], 'subId': keys[j]})
        }
      }
      this.payLoad = this.input.inputs
    })
    if(this.showAddMoreIdentityCheck){
      let keys  = Object.keys(this.subEntityDetailsForm.value)
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length] = []
      for (let j = 0; j < keys.length; j++) {

        this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'dynamic':this.subEntityDetailsForm.value[keys[j]], 'subId': keys[j]})
      }
      this.payLoad = this.input;
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
      this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds,  this.displayName);
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
        this. startUpload()
        this.patternDataService.getPatternData(this.candidate.resumeNumber.toString()).subscribe(
        response => {
          if(status == 'Save & Next' && res.status == "success" && res.message == "SUCCESS"){
            this.router.navigate(['/candidates/my-profile/database-check'])
          }
        })
      }
    })
  }

  setEntities(entityDetails?){
    if(entityDetails !== undefined){
      entityDetails.forEach(element => {
          this.entitiesList.push(this.service.getEntities(element)) 
      });
    }
  }

  errorHandler(error){
    console.log(error.error.message);
  }

  onUploadOutput(output: UploadOutput, fileDetails): void {
    if(output.type == 'start')
      this.loading = true
    if(output.type == 'done')
      this.loading = false;
    
    if(output.type === 'allAddedToQueue'){
      let sequenceId = fileDetails === undefined  && fileDetails.sequenceId === undefined ? "" : fileDetails.sequenceId.toString();
      let entityDataId = fileDetails === undefined  && fileDetails.entityDataId === undefined ? "" : fileDetails.entityDataId.toString();;
      const event: any = {
        type: 'uploadAll',
        url: 'https://appstore.wipro.com/iverify/rest/uploadService/uploadFile',
        method: 'POST',
        data: {file: this.files[this.files.length -1], companyCode:'WT',moduleType:'lateral',fileName: this.files[this.files.length -1].name ,userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId:entityDataId, sequenceNo:sequenceId, finalReportUpload:false,page:'Y' }
      };
      this.uploadInput.emit(event)
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      console.log(output.file.name + ' rejected');
      // this.files.push(output.file);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      this.files.push(output.file);
      // this.files[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  removeExisingFile(index, index1){
    this.filesArray.push(this.fileDetailsList[index][index1].fileId)
    delete this.filesNameArray[index][index1]
   }

  indexForIdentity = 0;
  onUploadIdentityOutput(output: UploadOutput): void {
    let flag = 0
    if(output.type == 'start')
    {
      // this.indexForIdentity = this.indexForIdentity + 1;
      this.loading = true
    }

      
    if(output.type == 'done'){
      this.loading = false;
    }
    if(output.type === 'allAddedToQueue'){
      // let sequenceId = fileDetails === undefined  && fileDetails.sequenceId === undefined ? "" : fileDetails.sequenceId.toString();
      // let entityDataId = fileDetails === undefined  && fileDetails.sequenceId === undefined ? "" : fileDetails.entityDataId.toString();;
      // const event: any = {
      //   type: 'uploadAll',
      //   url: 'https://appstore.wipro.com/iverify/rest/uploadService/uploadFile',
      //   method: 'POST',
      //   data: {file: this.filesForIdentities[0], companyCode:'WT',moduleType:'lateral',fileName: this.filesForIdentities[0].name ,userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId:entityDataId, sequenceNo:sequenceId, finalReportUpload:false,page:'Y' }
      // };
      // this.uploadInput.emit(event)
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      console.log(output.file.name + ' rejected');
      // this.filesForIdentities.push(output.file);
      if(output.file && this.filesForIdentities && this.filesForIdentities.length>0)
      this.filesForIdentities.forEach(file =>{
        //chech for duplicate file
        if(file.name === output.file.name && file.size === output.file.size){
          flag = 1
        }
      })
      if(flag === 0){
        this.filesForIdentities.push(output.file);
      }

    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      // this.filesForIdentities.push(output.file);
      if(output.file && this.filesForIdentities && this.filesForIdentities.length>0)
      this.filesForIdentities.forEach(file =>{
        //chech for duplicate file
        if(file.name === output.file.name && file.size === output.file.size){
          flag = 1
        }
      })
      if(flag === 0){
        this.filesForIdentities.push(output.file);
      }
      // this.filesForIdentities[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in filesForIdentities array for uploading file
      const index = this.filesForIdentities.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesForIdentities[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.filesForIdentities = this.filesForIdentities.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }


  startUpload(): void {
    if(this.filesForIdentities){
      if(this.filesForIdentities && this.filesForIdentities.length > 0){
        for (let index = 0; index < this.filesForIdentities.length; index++) {
          const event3: UploadInput = {
            type: 'uploadFile',
            url: LOA_DOCUMENT_UPLOAD_URL,
            method: 'POST',
            file: this.filesForIdentities[index],
            data : {companyCode:'WT',moduleType:'lateral',
            fileName:'additonal_ducuments_' + (index+1),
            userId:this.personalDetails.resumeNumber.toString(),resumeNumber:this.personalDetails.resumeNumber.toString(),masterId:this.accountDetails.masterId.toString(),entityDataId:this.entityDataId[this.entityDataId.length-1],sequenceNo:this.sequenceIds[this.sequenceIds.length-1], subSequenceNo: '3',finalReportUpload:'false',page:'Y'}
            };
          this.uploadInputForIdentities.emit(event3);
          }
      }
    }
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInputForIdentities.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
}

