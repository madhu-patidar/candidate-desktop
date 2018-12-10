
import { Component, Input, OnInit, EventEmitter, ViewChild}  from '@angular/core';
import { FormGroup, Validators, FormControl }   from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { ToastrService } from 'ngx-toastr';
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
import { LOA_DOCUMENT_UPLOAD_URL } from '../../../apis.constant';
import { CommetTextAreaComponent } from '../commet-text-area/commet-text-area.component';
import { CommonMethodsService } from '../../services/common-method.service';
import * as moment from 'moment';
import { AlertPopService } from '../../../shared/components/alert-pop/alert-pop.service';

@Component({
  selector: 'app-criminal-check',
  templateUrl: './criminal-check.component.html',
  styleUrls: ['./criminal-check.component.css']
})
export class CriminalCheckComponent implements OnInit {
  isPassportUpload: boolean = false;
  isLicenseUpload: boolean = false;
  isAadharUpload: boolean = false;
  isEntityDisabled: boolean = true;
  entityDataId: any;
  sequenceIds: any;
  showSuccessMessage: boolean;
  isFormInvalid: boolean;
  displayId: string;
  fileInfo: any;
  entityIds: any;
  accountDetails: any;
  uploadFiles: string;
  // files: any;
  documentCategory: any;
  subEntityDetailsForm: FormGroup;
  subEntityDetailsFormForCurrentAddress: FormGroup;
  moreEntities: EntityBase<any>[];
  moreEntitiesForCurrentAddress: EntityBase<any>[];
  showAddMoreAddress: boolean;
  subEntityDetails: any;
  subEntityExistingDetails: any;
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
  diffAddress : boolean = false;
  filesForCurrentProof: UploadFile[];fileDetailsList: any;screenNumber: any;
;
  options: UploaderOptions = { concurrency: 1, maxUploads: 100 };
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  uploadInputForAddressProof: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  filesForPassport : UploadFile[];
  uploadInputForPassport: EventEmitter<UploadInput>;
  filesForAadharcard : UploadFile[];
  uploadInputForAadharcard: EventEmitter<UploadInput>;
  filesForPan : UploadFile[];
  uploadInputForPan: EventEmitter<UploadInput>;

  @ViewChild(CommetTextAreaComponent) commetTextArea:CommetTextAreaComponent;
  showCurrentAddress: boolean;
  selectFromDate: boolean;
  selectToDate: boolean;
  selectFromDateForCurrent: boolean;
  selectToDateForCurrent: boolean;
  addressDocDetailsForm: FormGroup;
  uploadedOtherDocFiles: any;
  entityNotAvailable: boolean;
  maxDate: string;

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
    private commonMethodsService : CommonMethodsService,
    private alertPopService: AlertPopService,
  ) {
    this.filesForAadharcard = []
    this.filesForCurrentProof = [];
    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.files = []; // local uploading files array
    this.filesForPassport = [];
    this.filesForPan = [];
    this.uploadInputForAddressProof = new EventEmitter<UploadInput>();
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.uploadInputForAadharcard = new EventEmitter<UploadInput>();
    this.uploadInputForPassport = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.uploadInputForPan =  new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }
 
  ngOnInit() {
    this.getCandidate();
    this.setAddressDetails();
  }

  dispalyFromForPermanentAdd(){
    this.onSelect('NO');
    this.diffAddress = false;
    this.commonMethodsService.bodyScrollable();
  }

  showPopMessage(){
    window.scroll(0,0)
    this.commonMethodsService.bodyUnscrollable();
    this.diffAddress = true;
  }


 
  getCandidate(){
    this.candidate = this.candidateService.getCurrentCandidate();
    console.log('candidate',this.candidate);
  }

  /**
   * 
   * @param value 
   * 
   * Select on radio button for current address same as parmanent address.
   * If select 'NO', in duration array list added another element for toDate fromDate and display another form for current address.
   * 
   */
  onSelect(value:string){
    if(value === "NO"){
      if(!this.showCurrentAddress){
        this.duration[this.duration.length]  = {'comments': '-'};
      }
      this.moreEntitiesForCurrentAddress = this.service.getEntities(this.subEntityDetails);
      this.subEntityDetailsFormForCurrentAddress = this.ecs.toFormGroup(this.moreEntitiesForCurrentAddress);
      this.showCurrentAddress = true;
    }
    if(value === "YES"){
      if(this.showCurrentAddress){
        this.duration.splice(-1,1)
      }
      this.moreEntitiesForCurrentAddress = undefined;
      this.subEntityDetailsFormForCurrentAddress = undefined;
      this.showCurrentAddress = false;
    } 
  }

  NavigateToNext(){
    this.router.navigate(['/candidates/my-profile/drug-test'])
  }

  setAddressDetails(){
    this.accountDetails = this.patternDataService.getAccountDetails();
    this.personalDetails = this.patternDataService.getPersonalDetails();
    this.displayId = 'DIS4';
    let entity: any = this.patternDataService.getEntityData(this.displayId);
    if(!entity){
      this.NavigateToNext();
      return;
    }
    this.screenNumber = entity.index + 2;
    this.entityIds = entity.entityDetails.entityId;
    this.displayName = entity.entityDetails.displayName;
    this.subEntityDetails = entity.entityDetails.SubEntityDetails;

    if((this.personalDetails.bgv1_sub_status === 'SEEKCAND' || this.personalDetails.bgv2_sub_status === 'SEEKCAND' ) && entity.entityDataStatus === 'SEEKCAND'){
      this.isEntityDisabled = false;
    }

    //get documents details from address entity for indian candidate
    if(this.personalDetails.jobCountryCode === 'IND' ||         this.personalDetails.jobCountry === 'India' ){
      this.uploadedOtherDocFiles = entity.entityDetails.uploadedOtherDocFiles;
      if(this.uploadedOtherDocFiles && this.uploadedOtherDocFiles.length > 0){
        this.uploadedOtherDocFiles.map(element =>{
          if(element.document_category ==='FC124'){
            this.panDetails = element;
          }
          if(element.document_category ==='FC122'){
            this.aadhaarDetails = element;        
          }
          if(element.document_category ==='FC123'){
            this.passportDetails = element;
            
          }
        })
      }
      //calling initialize documnets form
      this.initForm();
    }
    this.subEntityExistingDetails = entity.entityDetails.subEntityExistingDetails;
    this.uploadedDocumentCategory = entity.entityDetails.fileDetails;
    this.documentCategory = entity.entityDetails.documentCategory;
    this.listOfForm();
    this.setEntities(this.subEntityExistingDetails);

    if(entity.entityDetails.durationDetails !== undefined && entity.entityDetails.durationDetails.length > 0){
      this.durationDetails = entity.entityDetails.durationDetails.sort((a, b) => a.sequenceId - b.sequenceId);      
      this.setDuration(this.durationDetails);
    }
    if(this.uploadedDocumentCategory !== undefined)
      this.setFilesName();
      
    // Get Input 
      this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds,  this.displayName, 'addressType');

  }

  //initializing addressDocdetails form for indian candidate uploading aadhaar/pan/passport details.
  initForm(){
    this.addressDocDetailsForm = new FormGroup({
      aadhaarCard: new FormControl( {value : this.aadhaarDetails ? this.aadhaarDetails.documentNumber : '', disabled: this.isEntityDisabled && this.subEntityExistingDetails && this.subEntityExistingDetails.length > 0}, [Validators.required] ),
      passport: new FormControl({value : this.passportDetails ? this.passportDetails.documentNumber : '',  disabled: this.isEntityDisabled && this.subEntityExistingDetails && this.subEntityExistingDetails.length > 0}),
      validTill: new FormControl({value:  this.passportDetails ? this.datePipe.transform(this.passportDetails.validTill, 'yyyy-MM-dd') : '',  disabled: this.isEntityDisabled && this.subEntityExistingDetails && this.subEntityExistingDetails.length > 0}),
      pan: new FormControl({value: this.panDetails ? this.panDetails.documentNumber : '',  disabled: this.isEntityDisabled && this.subEntityExistingDetails &&  this.subEntityExistingDetails.length > 0}, [Validators.required]),
      addressTypeCurrent: new FormControl({value: this.aadhaarDetails && (this.aadhaarDetails.addressType !== 'P')? true : false,  disabled: this.isEntityDisabled && this.subEntityExistingDetails && this.subEntityExistingDetails.length > 0}),
      addressTypeParmanet: new FormControl({value:  this.aadhaarDetails && (this.aadhaarDetails.addressType !== 'C')? true : false,  disabled: this.isEntityDisabled && this.subEntityExistingDetails && this.subEntityExistingDetails.length > 0} ),
      
    });
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
    this.fileDetailsList = fileDetailsList
    this.filesNameArray = filesNameArray
    console.log('this.fileDetailsList',this.fileDetailsList)
    console.log('this.filesNameArray',this.filesNameArray)
  }

  removeExisingFile(index, index1){
    this.filesArray.push(this.fileDetailsList[index][index1].fileId)
    delete this.filesNameArray[index][index1]
   }

  setDuration(duration?){
    // for (let index = 0; index < duration.length; index++) {
    //   this.duration[index] = {"fromDate" : duration[index].fromDate,"toDate" : duration[index].toDate,"comments":"-"};
    // }
    // console.log(this.duration);

    let durationDetails = []
    for (let i = 0; i < this.subEntityExistingDetails.length; i++) {
      durationDetails[i] = {};
    }
      for (let index = 0; index < duration.length; index++) {
          durationDetails[duration[index].sequenceId- 1] = {"fromDate" : duration[index].fromDate,"toDate" : duration[index].toDate,"comments":"-"};
        
      }

      this.durationDetails = durationDetails
      console.log('durationDetailst',this.durationDetails);
  }

    onChangeDate( lable?, date?,index?, dateFrom?){
      // if(lable === 'remark'){
      //   return 
      // }
      if(lable === 'fromDate' && dateFrom === 'addMoreFromDate'){
        this.selectFromDate = true;
      }
      if(lable === 'toDate' && dateFrom === 'addMoreToDate'){
        this.selectToDate = true;
      }

      if(lable === 'fromDate' && dateFrom === 'addMoreCurrentFromDate'){
        this.selectFromDateForCurrent = true;
      }
      if(lable === 'toDate' && dateFrom === 'addMoreCurrentToDate'){
        this.selectToDateForCurrent = true;
      }
      
      if((this.showCurrentAddress && index - 1 > this.duration.length) && (dateFrom === 'addMoreToDate' || dateFrom === 'addMoreFromDate')){
        this.duration[index-1] = {'comments': '-'};
      }
      if((this.showCurrentAddress) && (dateFrom === 'addMoreToDate' || dateFrom === 'addMoreFromDate')){
        this.duration[index-1][lable] = this.datePipe.transform(date, 'dd-LLL-yyyy');
        return;
      }
      else if(index > this.duration.length){
          this.duration[index] = {'comments': '-'};
        }
        if(lable == 'comments' ){
          this.duration[index][lable] =date;
        }else{
          this.duration[index][lable] = this.datePipe.transform(date, 'dd-LLL-yyyy');
        }
      }
  
  listOfForm(){
    if(this.subEntityExistingDetails !== undefined){
      this.subEntityExistingDetails.forEach(entities =>{
        this.formList.push( this.ecs.toFormGroup(this.service.getEntities(entities), this.isEntityDisabled))
      })
    }
  }

  addMoreAddress(){
    this.showAddMoreAddress = true;
    this.duration[this.duration.length]  = {'comments': '-'};
    this.moreEntities = this.service.getEntities(this.subEntityDetails);
    this.subEntityDetailsForm = this.ecs.toFormGroup(this.moreEntities);
  }

  removeAddress(){
    if(this.showCurrentAddress){
      this.duration.splice(-1,1);
      this.duration.splice(-1,1);
    }else{
      this.duration.splice(-1,1);
    }
    
    this.showAddMoreAddress = false;
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
    if(this.showAddMoreAddress && (this.subEntityDetailsForm.invalid || !this.selectToDate ||  !this.selectToDate)){
      validation = true;
    }
    if(this.showCurrentAddress && (this.subEntityDetailsFormForCurrentAddress.invalid || !this.selectToDateForCurrent ||  !this.selectFromDateForCurrent)){
      validation = true;
    }

    //validation check for Indian candidate document details
    // if((this.personalDetails.jobCountryCode === 'IND' || this.personalDetails.jobCountry === 'India') && this.addressDocDetailsForm.invalid ){
    //   validation = true;
    // }
    return validation
  }

  aadhaarDetails:any;
  panDetails:any;
  passportDetails:any;
  onSubmit(status?: any) {
    // this.onfilesSubmit()
    this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds,  this.displayName, 'addressType');
    this.isFormInvalid = false;

    if(this.durationDetails){
      //check To and From date validation for seekcand entity
      let duration = this.durationDetails[this.durationDetails.length-1]
      if(this.isEntityDisabled && duration && duration['toDate'] && duration['fromDate'] ){
        if((moment(duration['toDate']) < moment(duration['fromDate']))){
          this.alertPopService.error("To Date should be greater than From Date");
          return
        }
         //check To and From date validation for non-SEEKCAND entity
      }else{
        for (let index = 0; index < this.durationDetails.length; index++) {
          let d = this.durationDetails[index];
          if( index === this.durationDetails.length-1 && d && d['toDate'] && d['fromDate'] (moment(d['toDate']) < moment(d['fromDate']))){
            this.alertPopService.error("To Date should be greater than From Date");
            return
          } 
        }
      }
    }

    if(this.isInvalid()){
      
      // this.message = "Please fill all te fields marked with *"
      // this.isFormInvalid = true;
      this.alertPopService.error('Please fill all the fields marked with *')
      return false;
    }

    //validation for passport valid till date
    if((this.personalDetails.jobCountryCode === 'IND' || this.personalDetails.jobCountry === 'India') && (this.addressDocDetailsForm.value.passport && this.addressDocDetailsForm.value.passport.trim() !== '' ) && (!this.addressDocDetailsForm.value.validTill || (this.addressDocDetailsForm.value.validTill.trim() === '')) ){
      // this.message = "Please fill valid Till date for passport"
      // this.isFormInvalid = true;
      this.alertPopService.error('Please fill valid Till date for passport')
      return false;
    }
    this.loading = true;
    //bind existing entity details in subEntity of input json
    if(this.formList === undefined || (this.formList !== undefined && this.formList .length === 0)){
      this.input.inputs.subEntityDetails[0].subEntity[0] = []
    }
    for (let i = 0; i < this.formList.length; i++) {
      let keys  = Object.keys(this.formList[i].value)
      this.input.inputs.subEntityDetails[0].subEntity[i] = []
      for (let j = 0; j < keys.length; j++) {
        if(j == 0 && this.duration !== undefined && this.duration.length > 0){
          this.input.inputs.subEntityDetails[0].subEntity[i].push(this.duration[i]);
        }
        this.input.inputs.subEntityDetails[0].subEntity[i].push({'dynamic':this.formList[i].value[keys[j]], 'subId': keys[j]})
      }
    }

    //bind add more address check entity details in subEntity of input json
    if(this.showAddMoreAddress){
      let keys  = Object.keys(this.subEntityDetailsForm.value)
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length] = []
      for (let j = 0; j < keys.length; j++) {
        if(j==0){
          if(!this.showCurrentAddress){
            this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push(this.duration[this.duration.length-1]);
          }else{
            this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push(this.duration[this.duration.length-2]);
          }
        }
        this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'dynamic':this.subEntityDetailsForm.value[keys[j]], 'subId': keys[j]})
      }
    } 
     //bind address check entity details in subEntity of input json if current address and permanet address are diffrent 
    if(this.showCurrentAddress){
      let keys  = Object.keys(this.subEntityDetailsFormForCurrentAddress.value)
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length] = []
      for (let j = 0; j < keys.length; j++) {
        if(j==0)
        this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push(this.duration[this.duration.length-1]);
        this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'dynamic':this.subEntityDetailsFormForCurrentAddress.value[keys[j]], 'subId': keys[j]})
      }
    } 
    for (let index = 0; index < this.input.inputs.subEntityDetails[0].subEntity.length; index++) {
      if(this.input.inputs.subEntityDetails[0].subEntity[index].length === 0){
        this.input.inputs.subEntityDetails[0].subEntity.splice(index, 1);
      }  
    }

    //bind addhar/pan/passport details for Indian candidate in input json
    if(this.personalDetails.jobCountryCode === 'IND' ||         this.personalDetails.jobCountry === 'India' ){
      this.input.inputs.subEntityDetails[0]['aadhaarCard'] = this.addressDocDetailsForm.value.aadhaarCard;
      this.input.inputs.subEntityDetails[0]['pan'] = this.addressDocDetailsForm.value.pan;
      if(this.addressDocDetailsForm.value.passport){
        this.input.inputs.subEntityDetails[0]['passport'] = this.addressDocDetailsForm.value.passport;
        this.input.inputs.subEntityDetails[0]['vildTill'] = this.addressDocDetailsForm.value.vildTill;
      }
      if(this.addressDocDetailsForm.value.passport && this.addressDocDetailsForm.value.passport.trim() !=='' ){
        this.input.inputs.subEntityDetails[0]['passport'] = this.addressDocDetailsForm.value.passport;
        this.input.inputs.subEntityDetails[0]['validTill'] =  this.datePipe.transform(this.addressDocDetailsForm.value.validTill, 'dd-LLL-yyyy'); 
      }
      if(this.addressDocDetailsForm.value.addressTypeCurrent && this.addressDocDetailsForm.value.addressTypeParmanet){
        this.input.inputs.subEntityDetails[0]['addressType'] = "B"
      }else if(this.addressDocDetailsForm.value.addressTypeParmanet){
        this.input.inputs.subEntityDetails[0]['addressType'] = "P"
      }else{
        this.input.inputs.subEntityDetails[0]['addressType'] = "C"
      }
    }

    //remove extra blank array from subEntity of input json 
    if(!this.isEntityDisabled){
      this.commetTextArea.commentFormValue()
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'clarificationComments':this.commetTextArea.commentFormValue()});
    }
    //added delete files ids 
    this.input.inputs.fileArray = this.filesArray;
    
    //Save address check entity 
    this.patternDataService.entitySave(this.input).subscribe(res =>{
      this.loading = false;
      if(res.status =='failure'){
        this.alertPopService.error(res.message)
      // this.message = res.message;
      // this.showSuccessMessage = true;
      this.alertPopService.error(res.message)
      }else if(res.status == "success"){
      this.sequenceIds = res.sequenceNumbers;
      this.entityDataId = res.entityDataIds;
      if(status == 'Save' && res.status == "success" && res.message == "SUCCESS"){
        this.alertPopService.success(res.Message)
      }
      this.startUploaded();
      this.startDocUploaded();

      // after success address check get fresh pattern data
      this.patternDataService.getPatternData(this.candidate.resumeNumber.toString()).subscribe(
        response => {
          this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds,  this.displayName, 'addressType');
          if(status == 'Save & Next' && res.status == "success" && res.message == "SUCCESS"){
            this.NavigateToNext();
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

  errorHandler(error){

  }

  /**
  * files uploading funtionality 
  */
  
  onUploadOutput(output: UploadOutput, fileDetails?): void {
    let sequenceId = fileDetails !== undefined ? fileDetails.sequenceId.toString() : "";
    let entityDataId = fileDetails !== undefined ? fileDetails.entityDataId.toString() : "";
    if ((output.type === 'allAddedToQueue' || output.type === 'addedToQueue' ) && output.file !== undefined) { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      const event: any = {
        type: 'uploadAll',
        url: 'https://appstore.wipro.com/iverify/rest/uploadService/uploadFile',
        method: 'POST',
        data: {file:output.file, companyCode:'WT', moduleType:'lateral', fileName:output.file.name ,userId:this.personalDetails.resumeNumber.toString() ,resumeNumber:this.personalDetails.resumeNumber.toString() ,masterId:this.accountDetails.masterId.toString(), entityDataId:entityDataId,sequenceNo:sequenceId, finalReportUpload:false, page:'Y' }
      };
      this.uploadInput.emit(event);
    }
  }

  onUploadedDoc(output: UploadOutput, index?): void {
    let flag = 0;
    if(output.type === 'start')
    this.loading = true
    if(output.type === 'done'){
      this.loading = false;
    }
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      // this.filesForCurrentProof.push(output.file);
      if(output.file && this.filesForCurrentProof && this.filesForCurrentProof.length>0)
      this.filesForCurrentProof.forEach(file =>{
        //chech for duplicate file
        if(file.name === output.file.name && file.size === output.file.size){
          flag = 1
        }
      })
      if(flag === 0){
        this.filesForCurrentProof.push(output.file);
      }
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      // this.filesForCurrentProof.push(output.file);
      if(output.file && this.filesForCurrentProof && this.filesForCurrentProof.length>0)
      this.filesForCurrentProof.forEach(file =>{
        if(file.name === output.file.name && file.size === output.file.size){
          flag = 1
        }
      })
      if(flag === 0){
        this.filesForCurrentProof.push(output.file);
      }
      // this.filesForCurrentProof[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in filesForCurrentProof array for uploading file
      const index = this.filesForCurrentProof.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesForCurrentProof[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.filesForCurrentProof = this.filesForCurrentProof.filter((file: UploadFile) => file !== output.file);
    } 
  }

  startDocUploaded(){
    if(this.filesForCurrentProof && this.filesForCurrentProof.length > 0){
    for (let index = 0; index < this.filesForCurrentProof.length; index++) {
      const event: UploadInput = {
        type: 'uploadFile',
        url: LOA_DOCUMENT_UPLOAD_URL,
        method: 'POST',
        file :this.filesForCurrentProof[index] ,
        data: {companyCode:'WT',moduleType:'lateral',
        userId:this.personalDetails.resumeNumber.toString(), fileName: 'current_address_proof_' + (index+1).toString(), subSequenceNo: '1',resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId: this.entityDataId[this.entityDataId.length-1], sequenceNo:this.sequenceIds[this.sequenceIds.length-1], finalReportUpload:'false',page:'Y' },
        };
      this.uploadInputForAddressProof.emit(event);  
     } 
    }
  }

  removeFileFromAddressProof(id: string, index): void {
    this.uploadInputForAddressProof.emit({ type: 'remove', id: id });
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  passportUpload(output: UploadOutput, fileDetails?): void {
    this.isPassportUpload = true;
    if(output.type === 'start')
    this.loading = true
    if(output.type === 'done'){
      this.loading = false;
    }
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      this.filesForPassport.push(output.file);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      this.filesForPassport.push(output.file);
      // this.filesForPassport[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in filesForPassport array for uploading file
      const index = this.filesForPassport.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesForPassport[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.filesForPassport = this.filesForPassport.filter((file: UploadFile) => file !== output.file);
    }
  }

  panUpload(output: UploadOutput, fileDetails?): void {
    if(output && output.file){
    }
    this.isLicenseUpload = true;
    if(output.type === 'start')
    this.loading = true
    if(output.type === 'done'){
      this.loading = false;
    }
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      this.filesForPan.push(output.file);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      this.filesForPan.push(output.file);
      // this.filesForPan[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in filesForPan array for uploading file
      const index = this.filesForPan.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesForPan[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.filesForPan = this.filesForPan.filter((file: UploadFile) => file !== output.file);
    }
  }
  aadharUpload(output: UploadOutput, fileDetails?): void {
    this.isAadharUpload = true;
    if(output.type === 'start')
    this.loading = true
    if(output.type === 'done'){
      this.loading = false;
    }
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      this.filesForAadharcard.push(output.file);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      this.filesForAadharcard.push(output.file);
      // this.filesForAadharcard[0] = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in filesForAadharcard array for uploading file
      const index = this.filesForAadharcard.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesForAadharcard[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.filesForAadharcard = this.filesForAadharcard.filter((file: UploadFile) => file !== output.file);
    }
  }

  startUploaded(){
    let addressType = 'string'
    if(this.addressDocDetailsForm.value.addressTypeCurrent && this.addressDocDetailsForm.value.addressTypeParmanet){
      addressType = 'B'
    }else if(this.addressDocDetailsForm.value.addressTypeCurrent){
      addressType = 'C'
    }else if(this.addressDocDetailsForm.value.addressTypePermanent){
      addressType = 'P'
    }
    if(this.filesForAadharcard && this.filesForAadharcard.length > 0){
      for (let index = 0; index < this.filesForAadharcard.length; index++) {
        const event: any = {
          type: 'uploadFile',
            url: LOA_DOCUMENT_UPLOAD_URL,
            method: 'POST',
            file :this.filesForAadharcard[index] ,
            data : {companyCode:'WT',moduleType:'lateral', fileName:this.filesForAadharcard[index].name, userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(),masterId:this.accountDetails.masterId.toString(), entityDataId:this.entityDataId[this.entityDataId.length-1],sequenceNo:this.sequenceIds[this.sequenceIds.length-1], finalReportUpload:false,page:'Y', "entityDesc": 'Address Check',
            "documentCategory" : 'FC122', "documentNumber" : this.addressDocDetailsForm.value.aadhaarCard,"validTill" : '',       "addressType" :addressType}
        };
        this.uploadInputForAadharcard.emit(event);
      }
    }

    if(this.filesForPan && this.filesForPan.length > 0){
      for (let index = 0; index < this.filesForPan.length; index++) {
        const event2: any = {
          type: 'uploadFile',
          url: LOA_DOCUMENT_UPLOAD_URL,
          method: 'POST',
          file :this.filesForPan[index] ,
          data : {companyCode:'WT',moduleType:'lateral', fileName:this.filesForPan[index].name, userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(),masterId:this.accountDetails.masterId.toString(), entityDataId:this.entityDataId[this.entityDataId.length-1],sequenceNo:this.sequenceIds[this.sequenceIds.length-1], finalReportUpload:false,page:'Y', "entityDesc": 'Address Check',
          "documentCategory" : 'FC124', "documentNumber" : this.addressDocDetailsForm.value.pan,"validTill" : '', "addressType" :addressType}
          };
        this.uploadInputForPan.emit(event2);
      }
    }
    if(this.filesForPassport && this.filesForPassport.length > 0){
      for (let index = 0; index < this.filesForPassport.length; index++) {
        const event3: any = {
          type: 'uploadFile',
            url: LOA_DOCUMENT_UPLOAD_URL,
            method: 'POST',
            file :this.filesForPassport[index] ,            
            data : {companyCode:'WT',moduleType:'lateral', fileName:this.filesForPassport[index].name, userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(),masterId:this.accountDetails.masterId.toString(), entityDataId:this.entityDataId[this.entityDataId.length-1],sequenceNo:this.sequenceIds[this.sequenceIds.length-1], finalReportUpload:false,page:'Y', "entityDesc": 'Address Check',
            "documentCategory" : 'FC123', "documentNumber" :  this.addressDocDetailsForm.value.passport,"validTill" : this.datePipe.transform(this.addressDocDetailsForm.value.validTill, 'dd-LLL-yyyy'),"addressType" :addressType}
        }; 
        this.uploadInputForPassport.emit(event3);
      }
    }
  }
}