
import { Component, OnInit, EventEmitter, ViewChild, ElementRef }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { PatternDataService } from '../../services/pattern-data.service';
import { DOCUMENT_FORMAT_LIST } from './../my-profile.constant';
import { EntityBase }              from '../../../shared/dynamic-form/entity-base';
import { EntityControlService }    from '../../../shared/dynamic-form/entity-control.service';
import { EntityService } from '../../../shared/dynamic-form/entity.service';
import { CandidateService } from '../../services/candidate.service';
import { PersonalDetails } from '../personal-details/personal-details.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MyProfileService } from '../my-profile.service';
import { LOA_DOCUMENT_UPLOAD_URL } from '../../../apis.constant';
import { CommetTextAreaComponent } from '../commet-text-area/commet-text-area.component';
import * as moment from 'moment';
import { AlertPopService } from '../../../shared/components/alert-pop/alert-pop.service';

@Component({
  selector: 'app-education-details',
  templateUrl: './education-details.component.html',
  styleUrls: ['./education-details.component.css']
})
export class EducationDetailsComponent implements OnInit {

  showErrorPop: boolean;
  supporttedFormats = DOCUMENT_FORMAT_LIST;
  isEntityDisabled: boolean = true;
  entityDataStatus: any;
  bgSubStatus1: string;
  bgSubStatus2: string;
  entityDataId: any;
  sequenceIds: any;
  showSuccessMessage: boolean;
  message: any;
  isFormInvalid: boolean = false;
  errorMessage: string = "Please fill all the fields marked with *";
  displayId: string;
  durationList: any;
  fileUrl: any;
  uploadFiles: string;
  label: any;
  numFiles: any;
  // files: any = [];
  documentCategory: any;
  subEntityDetailsForm: FormGroup;
  moreEntities: EntityBase<any>[];
  showAddMoreEducation: boolean;
  subEntityDetails: any;
  subEntityExistingDetails: any = [];
  payLoad:any;
  loading:boolean = false;
  candidate:any;
  formList = [];
  input:any;
  personalDetails: PersonalDetails
  displayName = '';
  durationDetails:any = [];
  uploadedDocumentCategory:any = [];
  // duration: any = [];
  filesArray:any = [];
  entitiesList:any = [];
  filesNameArray:any = [];
  accountDetails:any;
  entityIds = "";
  fileDetailsList = [];
  uploadingFileList = [];
  options: UploaderOptions = { concurrency: 1, maxUploads: 200, allowedContentTypes:  DOCUMENT_FORMAT_LIST  };
  optionsForMarksheet: UploaderOptions = { concurrency: 1, maxUploads: 100,  allowedContentTypes:  DOCUMENT_FORMAT_LIST};
  optionsForDegree: UploaderOptions = { concurrency: 1, maxUploads: 100,  allowedContentTypes:  DOCUMENT_FORMAT_LIST };
  formData: FormData;
  files: UploadFile[];
  filesForMarkSheet: UploadFile[];
  filesForDegree : UploadFile[];
  filesForAdditonalDucuments : UploadFile[];
  uploadInputForDegree: EventEmitter<UploadInput>;
  uploadInput: EventEmitter<UploadInput>;
  uploadInputForMarkSheet: EventEmitter<UploadInput>;
  uploadInputForAdditonalDucuments: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  isDegreeUpload:boolean = false;
  ismarkSheetsUpload:boolean = false;
  maxDate;

  @ViewChild(CommetTextAreaComponent) commetTextArea:CommetTextAreaComponent;
  @ViewChild('fileInputViewChild')fileInputViewChild : ElementRef;

  entityNotAvailable: boolean;
  screenNumber: any;

  constructor
  (
    private ecs: EntityControlService,
    private service: EntityService,
    private patternDataService : PatternDataService,
    private candidateService : CandidateService,
    private datePipe: DatePipe,
    private router : Router,
    private myProfileService : MyProfileService,
    private alertPopService: AlertPopService,
  ) {
    this.maxDate = this.datePipe.transform(new Date, 'yyyy-MM-dd')
    this. options = { concurrency: 1, maxUploads: 200, allowedContentTypes:  DOCUMENT_FORMAT_LIST  };
    this.files = []; // local uploading files array
    this.filesForAdditonalDucuments = [];
    this.filesForMarkSheet = []; // local uploading files array
    this.filesForDegree = [];
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.uploadInputForAdditonalDucuments = new EventEmitter<UploadInput>();
    this.uploadInputForDegree = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.uploadInputForMarkSheet = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }
 
  ngOnInit() {
    // this.loading = true;
    this.getCandidate();
  }
 
  getCandidate(){
    this.candidate = this.candidateService.getCurrentCandidate();
    this.setEducationDetails();
  }

  removeDurationIndex = [];
  setEducationDetails(){
    if(this.patternDataService.getAccountDetails() != null){
      this.accountDetails = this.patternDataService.getAccountDetails()
    }
    if(this.patternDataService.getPersonalDetails() != null)
      this.personalDetails =this.patternDataService.getPersonalDetails();;
    
      this.displayId = 'DIS1';
      let entity: any = this.patternDataService.getEntityData(this.displayId);
      if(!entity){
        this.NavigateToNext();
        return;
      }
      this.screenNumber = entity.index + 2;
      this.entityIds = entity.entityDetails.entityId;
      this.bgSubStatus1 = this.personalDetails.bgv1_sub_status;
      this.bgSubStatus2 = this.personalDetails.bgv2_sub_status;
      this.entityDataStatus = entity.entityDataStatus;
      if((this.bgSubStatus1 === 'SEEKCAND' || this.bgSubStatus2 === 'SEEKCAND' ) && this.entityDataStatus=== 'SEEKCAND'){
        this.isEntityDisabled = false;
      }

      // this.isEntityDisabled = true;
      this.displayName = entity.displayName;
      this.subEntityDetails = entity.entityDetails.SubEntityDetails;
      if( entity.entityDetails.subEntityExistingDetails !== undefined && entity.entityDetails.subEntityExistingDetails.length > 0){
      //Only Highest education details show
      entity.entityDetails.subEntityExistingDetails.map((subEntityDetails) =>{
        subEntityDetails.map((e) => { 
          if(e.nameOfSubEntityField === 'Education name' && (e.value === 'PGR' || e.value === 'GR')){// GR, PGR 
            this.subEntityExistingDetails.push(subEntityDetails);
          }
          if(e.nameOfSubEntityField === 'Education name' && (e.value !== 'PGR' && e.value !== 'GR')){// GR, PGR 
            this.removeDurationIndex.push(subEntityDetails[0].sequenceId);
          }
        })
      })

      this.removeDurationIndex = this.removeDurationIndex.sort((a,b) => a-b).reverse();
      this.setEntities(this.subEntityExistingDetails);
      }
     
      this.documentCategory = entity.entityDetails.documentCategory;
      this.listOfForm();

      if(entity.entityDetails.durationDetails !==undefined && entity.entityDetails.durationDetails.length > 0){
        this.durationDetails = entity.entityDetails.durationDetails.sort((a, b) => a.sequenceId - b.sequenceId);

        for (let index = 0; index < this.removeDurationIndex.length; index++) {
          this.durationDetails.splice(this.removeDurationIndex[index-1], 1);
  
        }

        if(this.durationDetails && this.durationDetails.length >0)
        this.setDuration(this.durationDetails);
      }
      if(entity.entityDetails.fileDetails !== undefined && entity.entityDetails.fileDetails.length > 0){
        this.uploadedDocumentCategory = entity.entityDetails.fileDetails
        ;
        this.setFilesName();
      }

      // Get Input 
      this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds, this.displayName, 'edFlag');
    this.loading = false;
  }

  removeExisingFile(index, index1){
   this.filesArray.push(this.fileDetailsList[index][index1].fileId)
   delete this.filesNameArray[index][index1]
  }

  setFilesName(){
    let j = 1
    let filesNameArray = []
    let fileDetailsList = []
    for (let i = 0; i < this.subEntityExistingDetails.length; i++) {
      filesNameArray[i] = [];
      fileDetailsList[i] = []
    }
    for (let index = 0; index < this.uploadedDocumentCategory.length; index++) {
      for (let i = 0; i < this.uploadedDocumentCategory[index].length; i++) {
        if(filesNameArray[this.uploadedDocumentCategory[index][i].sequenceId - 1])
        filesNameArray[this.uploadedDocumentCategory[index][i].sequenceId - 1].push(this.uploadedDocumentCategory[index][i].fileName);
        if(fileDetailsList[this.uploadedDocumentCategory[index][i].sequenceId - 1])
       fileDetailsList[this.uploadedDocumentCategory[index][i].sequenceId - 1].push(this.uploadedDocumentCategory[index][i])
        j++;
      }
    }
    this.filesNameArray = filesNameArray
    this.fileDetailsList = fileDetailsList;
    for (let index = 0; index < this.removeDurationIndex.length; index++) {
      this.fileDetailsList.splice(this.removeDurationIndex[index-1], 1);
      this.filesNameArray.splice(this.removeDurationIndex[index-1], 1);
    }
    console.log('this.fileDetailsList',this.fileDetailsList)
  }

  setDuration(duration?){
    let durationDetails = []
    for (let i = 0; i < this.subEntityExistingDetails.length; i++) {
      durationDetails[i] = {};
    }
    console.log('duration------', duration)
      for (let index = 0; index < duration.length; index++) {
          durationDetails[duration[index].sequenceId- 1] = {"fromDate" : this.datePipe.transform(duration[index].fromDate, 'dd-LLL-yyyy'),"toDate" : this.datePipe.transform(duration[index].toDate, 'dd-LLL-yyyy') ,"comments":"-"};
        
      }

      this.durationDetails = durationDetails
    // console.log('durationDetailst',this.durationDetails);
  }

  selectFromDate: boolean = false;
  selectToDate: boolean = false;
  onChangeDate( lable?, date?,index?, dateFrom?){

    if(lable === 'fromDate' && dateFrom === 'addMoreFromDate'){
      this.selectFromDate = true;
    }
    if(lable === 'toDate' && dateFrom === 'addMoreToDate'){
      this.selectToDate = true;
    }
  if(index > this.durationDetails.length){
      this.durationDetails[index] = {'comments': '-'};
    }
    this.durationDetails[index][lable] = this.datePipe.transform(date, 'dd-LLL-yyyy');
  }
  listOfForm(){
    if( this.subEntityExistingDetails !== undefined){
      this.subEntityExistingDetails.forEach(entities =>{
        this.formList.push( this.ecs.toFormGroup(this.service.getEntities(entities), this.isEntityDisabled))
      })
    }
  }

  NavigateToNext(){
    this.router.navigate(['/candidates/my-profile/work-experience'])
  }

  addGraduation(){
    this.durationDetails[this.durationDetails.length]  = {'comments': '-'};
    this.showAddMoreEducation = true
    // console.log(this.subEntityDetails)
    this.moreEntities = this.service.getEntities(this.subEntityDetails);
    this.subEntityDetailsForm = this.ecs.toFormGroup(this.moreEntities);
  }

  RemoveGraduation(){
    this.durationDetails.splice(-1,1)
    this.showAddMoreEducation = false;
    // console.log(this.subEntityDetails)
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
    if(this.showAddMoreEducation && (this.subEntityDetailsForm.invalid || !this.selectToDate ||  !this.selectFromDate)){
      validation = true;
    }
    return validation
  }

  onSubmit(status?: any) {
    //check To From date validation 
    if(this.durationDetails){
      //check To and From date validation for seekcand entity
      if(this.isEntityDisabled){
        if((moment(this.durationDetails[this.durationDetails.length-1]['toDate']) < moment(this.durationDetails[this.durationDetails.length-1]['fromDate']))){
          this.alertPopService.error("To Date should be greater than From Date");
          return
        }
         //check To and From date validation for non-SEEKCAND entity
      }else{
        for (let index = 0; index < this.durationDetails.length; index++) {
          if( index === this.durationDetails.length-1 &&  (moment(this.durationDetails[index]['toDate']) < moment(this.durationDetails[index]['fromDate']))){
            this.alertPopService.error("To Date should be greater than From Date");
            return
          } 
        }
      }
    }

    this.isFormInvalid = false;
    if((this.formList === undefined || (this.formList !== undefined && this.formList .length === 0)) && !this.showAddMoreEducation){
      // this.message = "Please add education details"
      // this.isFormInvalid = true;
      this.alertPopService.error("Please add education details");
      return;
    }
    if(this.isInvalid()){
      // this.message = "Please fill all the fields marked with *"
      // this.isFormInvalid = true;
      this.alertPopService.error("Please fill all the fields marked with *");
      return false;
    }

    if(this.showAddMoreEducation && ((this.filesForMarkSheet && this.filesForMarkSheet.length === 0) || this.filesForDegree && this.filesForDegree.length === 0)){
      // this.message = "Please upload all documents marked with *"
      // this.isFormInvalid = true;
      this.alertPopService.error("Please upload all documents marked with *");
      return false;
    }

    this.loading = true;
    this.input.inputs.subEntityDetails[0].subEntity[0] = []

    for (let i = 0; i < this.formList.length; i++) {
      let keys  = Object.keys(this.formList[i].value)
      this.input.inputs.subEntityDetails[0].subEntity[i] = []
      for (let j = 0; j < keys.length; j++) {
          if(j==0 && this.durationDetails !==undefined && this.durationDetails.length > 0){
            this.input.inputs.subEntityDetails[0].subEntity[i].push(this.durationDetails[i]);
          }
        this.input.inputs.subEntityDetails[0].subEntity[i].push({'dynamic':this.formList[i].value[keys[j]], 'subId': keys[j]})
      }
    }

  this.payLoad = this.input.inputs;
    if(this.showAddMoreEducation){
      let keys  = Object.keys(this.subEntityDetailsForm.value)
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length] = []
      for (let j = 0; j < keys.length; j++) {
        
        if(j==0 && this.durationDetails !==undefined && this.durationDetails.length > 0){
          this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push(this.durationDetails[this.durationDetails.length-1]);
        }
        this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'dynamic':this.subEntityDetailsForm.value[keys[j]], 'subId': keys[j]})
      }
      this.payLoad = this.input.inputs;
    }

    for (let index = 0; index < this.input.inputs.subEntityDetails[0].subEntity.length; index++) {
      if(this.input.inputs.subEntityDetails[0].subEntity[index].length === 0){
        this.input.inputs.subEntityDetails[0].subEntity.splice(index, 1);
      }  
    }
    if(!this.isEntityDisabled && (this.formList && this.formList.length > 0)){
      this.commetTextArea.commentFormValue()
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'clarificationComments':this.commetTextArea.commentFormValue()});
    }
    this.input.inputs.fileArray = this.filesArray;
    this.patternDataService.entitySave(this.input).subscribe(res =>{
      this.loading = false;
      this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds,  this.displayName, 'edFlag');      
      if(res.status =='failure'){
      // this.message = res.message;
      // this.isFormInvalid = true;
      this.alertPopService.error(res.message);
      }else if(res.status == "success"){
        this.sequenceIds = res.sequenceNumbers;
        this.entityDataId = res.entityDataIds;
        if(status == 'Save' && res.status == "success" && res.message == "SUCCESS"){
          this.alertPopService.success(res.Message);
        }
        this.patternDataService.getPatternData(this.candidate.resumeNumber.toString()).subscribe(
          response => {
            this.startMarkshitsUploaded();
            if(status == 'Save & Next' && res.status == "success" && res.message == "SUCCESS"){
              this.router.navigate(['/candidates/my-profile/work-experience'])
            }
          }
        )
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

  onUploadOutput(output: UploadOutput, fileDetails) {
    if(output && output.file && output.file.type && this.supporttedFormats.indexOf(output.file.type) < 0){
      // alert("Uploaded only PNG / JPG / JPEG / PDF / DOC / HTML / MSG / DOCX / TEXT / GIF / MDI formats");
      return;
    }

    if(output.type == 'start')
      this.loading = true;
      if(output.type === 'done'){
        this.loading = false;
        if(output.file.response.status === 'failure'){
          // alert('An error occurred while uploading ' + output.file.name + '. Please try again');
          // this.errorMessage = 'An error occurred while uploading ' + output.file.name + '. Please try again';
          // this.showErrorPop = true;
        }
      }  
    if(output.type == 'rejected')
      this.files[0] = output.file;

    if(output.type === 'allAddedToQueue' && output.file == undefined && this.files[0] !== undefined){
      let sequenceId = fileDetails !== undefined && fileDetails.sequenceId !== undefined ? fileDetails.sequenceId.toString() : ""
      const event: any = {
        type: 'uploadAll',
        url: LOA_DOCUMENT_UPLOAD_URL,
        method: 'POST',
        data: {file: this.files[0], companyCode:'WT',moduleType:'lateral',
        // fileName: this.files[0].name ,
        userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId:this.subEntityExistingDetails[0][0].entityDataId.toString(), sequenceNo:sequenceId, finalReportUpload:false,page:'Y' }
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
        data: {file: output.file, companyCode:'WT',moduleType:'lateral',fileName: output.file.name ,userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId:this.subEntityExistingDetails[0][0].entityDataId.toString(), sequenceNo:sequenceId, finalReportUpload:false,page:'Y' }
      };
      // this.uploadingFileList.push(event);      
      this.uploadInput.emit(event); 
    }
  }

  startMarkshitsUploaded(){
    if(this.filesForMarkSheet && this.filesForMarkSheet.length > 0){

    for (let index = 0; index < this.filesForMarkSheet.length; index++) {
      const event: UploadInput = {
        type: 'uploadFile',
        url: LOA_DOCUMENT_UPLOAD_URL,
        method: 'POST',
        file :this.filesForMarkSheet[index] ,
        data: {companyCode:'WT',moduleType:'lateral',
        userId:this.personalDetails.resumeNumber.toString(), subSequenceNo: '1',resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId: this.entityDataId[this.entityDataId.length-1], sequenceNo:this.sequenceIds[this.sequenceIds.length-1], finalReportUpload:'false',page:'Y' },
        };
      this.uploadInputForMarkSheet.emit(event);  
     } 
    }

    if(this.filesForDegree && this.filesForDegree.length > 0){
      for (let index = 0; index < this.filesForDegree.length; index++) {
        const event2: UploadInput = {
          type: 'uploadFile',
          url: LOA_DOCUMENT_UPLOAD_URL,
          method: 'POST',
          file : this.filesForDegree[index],
          data : {companyCode:'WT',moduleType:'lateral',
          fileName:this.filesForDegree[index].name,
          userId:this.personalDetails.resumeNumber.toString(),resumeNumber:this.personalDetails.resumeNumber.toString(),masterId:this.accountDetails.masterId.toString(),entityDataId:this.entityDataId[this.entityDataId.length-1],sequenceNo:this.sequenceIds[this.sequenceIds.length-1], subSequenceNo: '2',finalReportUpload:'false',page:'Y'}
          };
        this.uploadInputForDegree.emit(event2);
      }
    }

    if(this.filesForAdditonalDucuments && this.filesForAdditonalDucuments.length > 0){
      for (let index = 0; index < this.filesForAdditonalDucuments.length; index++) {
        const event3: UploadInput = {
          type: 'uploadFile',
          url: LOA_DOCUMENT_UPLOAD_URL,
          method: 'POST',
          file: this.filesForAdditonalDucuments[index],
          data : {companyCode:'WT',moduleType:'lateral',
          // fileName:'additonal_ducuments_' + (index+1),
          userId:this.personalDetails.resumeNumber.toString(),resumeNumber:this.personalDetails.resumeNumber.toString(),masterId:this.accountDetails.masterId.toString(),entityDataId:this.entityDataId[this.entityDataId.length-1],sequenceNo:this.sequenceIds[this.sequenceIds.length-1], subSequenceNo: '3',finalReportUpload:'false',page:'Y'}
          };
        this.uploadInputForAdditonalDucuments.emit(event3);
        }
    }
  }

  onMarksheetsUploaded(output: UploadOutput, fileDetails?): void {
    if(output && output.file && output.file.type && this.supporttedFormats.indexOf(output.file.type) < 0){
      return;
    }
    this.ismarkSheetsUpload = true;
    if(output.type === 'start')
    this.loading = true
    if(output.type === 'done'){
      this.loading = false;
    }
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      this.filesForMarkSheet[0] = output.file;
      // this.filesForMarkSheet.push(output.file);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      // this.filesForMarkSheet.push(output.file);
      this.filesForMarkSheet[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in filesForMarkSheet array for uploading file
      const index = this.filesForMarkSheet.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesForMarkSheet[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.filesForMarkSheet = this.filesForMarkSheet.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  onDegreeUploaded(output: UploadOutput, fileDetails?): void {
    this.isDegreeUpload = true;
    if(output.type === 'start')
      this.loading = true;
    if(output.type === 'done'){
      this.loading = false;
    }
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      this.filesForDegree[0] = output.file;
      // this.filesForDegree.push(output.file);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      // this.filesForDegree.push(output.file);
      this.filesForDegree[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in filesForDegree array for uploading file
      const index = this.filesForDegree.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesForDegree[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.filesForDegree = this.filesForDegree.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }


  onAddinalDocsUploaded(output: UploadOutput, fileDetails?): void {
    let flag = 0
    if(output.type === 'start')
    this.loading = true
    if(output.type === 'done'){
      this.loading = false;
      if(output.file.response.status === 'failure'){
        // alert('An error occurred while uploading' + output.file.name + 'please try again');

      }
    }
    if (output.type === 'allAddedToQueue') { // when all files added in queue

    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      // this.filesForAdditonalDucuments.push(output.file);
      if(output.file && this.filesForAdditonalDucuments && this.filesForAdditonalDucuments.length>0)
      this.filesForAdditonalDucuments.forEach(file =>{
        if(file.name === output.file.name && file.size === output.file.size){
          flag = 1
        }
      })
      if(flag === 0){
        this.filesForAdditonalDucuments.push(output.file);
      }
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      
      if(output.file && this.filesForAdditonalDucuments && this.filesForAdditonalDucuments.length>0)
      this.filesForAdditonalDucuments.forEach(file =>{
        if(file.name === output.file.name && file.size === output.file.size){
          flag = 1
        }
      })

      if(flag === 0){
        this.filesForAdditonalDucuments.push(output.file);
      }
      // this.filesForAdditonalDucuments.push(output.file);
      // this.filesForAdditonalDucuments[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in filesForAdditonalDucuments array for uploading file
      const index = this.filesForAdditonalDucuments.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesForAdditonalDucuments[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.filesForAdditonalDucuments = this.filesForAdditonalDucuments.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  cancelUpload(id: string, index?): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string, index): void {
    this.uploadInputForMarkSheet.emit({ type: 'remove', id: id });
    this.fileInputViewChild.nativeElement.value = null;
  }

  removeFileFromDegree(id: string, index): void {
    this.uploadInputForDegree.emit({ type: 'remove', id: id });
    // this.fileInputViewChild.nativeElement.value = null;
  }

  removeFileFromAdditonalDucuments(id: string, index): void {
    this.fileInputViewChild.nativeElement.value = null;
    this.uploadInputForAdditonalDucuments.emit({ type: 'remove', id: id });

  }

  removeAllFiles(): void {
    this.fileInputViewChild.nativeElement.value = null;
    this.uploadInput.emit({ type: 'removeAll' });
  }

  errorHandler(error){ 
    console.log(error.error.message);
  }

}