
import { Component, Input, OnInit, ViewChild }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';

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
import { AlertPopService } from '../../../shared/components/alert-pop/alert-pop.service';

@Component({
  selector: 'app-database-check',
  templateUrl: './database-check.component.html',
  styleUrls: ['./database-check.component.css']
})
export class DatabaseCheckComponent implements OnInit {

  isEntityDisabled: boolean = true;
  showSuccessMessage: boolean;
  message: any;
  errorMessage: string;
  isFormInvalid: boolean;
  displayId: string;
  entityIds: any;
  accountDetails: any;
  fileUrl: any;
  uploadFiles: string;
  label: any;
  numFiles: any;
  files: any;
  documentCategory: any;
  subEntityDetailsForm: FormGroup;
  moreEntities: EntityBase<any>[];
  showAddMoreEducation: boolean;
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
  }
 
  ngOnInit() {
    // this.alertPopService.success('Hello world!', 'alertPopService fun!', {
    //   closeButton: true
    // });


    this.getCandidate();
    this.getPatternData();
    
  }
 
  getCandidate(){
    this.candidate = this.candidateService.getCurrentCandidate();
    console.log('candidate',this.candidate);
  }

  getPatternData(){
    let patternData = JSON.parse(localStorage.getItem('patternData'));
    this.setDatabaseCheck()
  }

  NavigateToNext(){
    this.router.navigate(['/candidates/my-profile/loa'])
  }

  setDatabaseCheck(){
    this.accountDetails = this.patternDataService.getAccountDetails();
    this.personalDetails = this.patternDataService.getPersonalDetails();
    this.displayId = 'DIS9';
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
    this.listOfForm();
    this.setEntities(this.subEntityExistingDetails);
      
    if((this.personalDetails.bgv1_sub_status === 'SEEKCAND' || this.personalDetails.bgv2_sub_status === 'SEEKCAND' ) && entity.entityDataStatus === 'SEEKCAND'){
      this.isEntityDisabled = false;
    }
    // Get Input 
    this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds,  this.displayName);

    if(this.subEntityExistingDetails === undefined || this.subEntityExistingDetails.length ==0 ){
      this.addDatabaseCheck()
    }
  }

  addDatabaseCheck(){
    this.showAddMoreEducation = true
    console.log(this.subEntityDetails)
    this.moreEntities = this.service.getEntities(this.subEntityDetails);
    this.subEntityDetailsForm = this.ecs.toFormGroup(this.moreEntities);
  }


  onChangeDate(index?, lable?, date?){
    if(index > this.duration.length){
      this.duration[index] = {'comments': '-'};
    }
    this.duration[index][lable] = this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  listOfForm(){
    if(this.subEntityExistingDetails !== undefined){
      this.subEntityExistingDetails.forEach(entities =>{
        this.formList.push( this.ecs.toFormGroup(this.service.getEntities(entities), this.isEntityDisabled))
      })
    }
  }

  isInvalid(){
    let validation:boolean = false
    this.formList.forEach(form => {
      if(form.invalid){
        validation = true;
      }
    });
    if(this.showAddMoreEducation && this.subEntityDetailsForm.invalid){
      validation = true;
    }
    return validation
  }

  onSubmit(status?: any) {
    // this.onfilesSubmit()
    this.isFormInvalid = false;
    if(this.isInvalid()){
      // this.message = "Please fill all te fields marked with *"
      // this.isFormInvalid = true;
      this.alertPopService.error('Please fill all te fields marked with *');
      return false;
    }
    this.loading = true;
    if(this.formList === undefined || (this.formList !== undefined && this.formList .length === 0)){
      this.input.inputs.subEntityDetails[0].subEntity[0] = []
    }
    // this.onfilesSubmit();
    if(!this.showAddMoreEducation){
        for (let i = 0; i < this.formList.length; i++) {
          let keys  = Object.keys(this.formList[i].value)
          this.input.inputs.subEntityDetails[0].subEntity[i] = []
          for (let j = 0; j < keys.length; j++) {
            if(j==0 && this.duration !== undefined && this.duration.length > 0)
              this.input.inputs.subEntityDetails[0].subEntity[i].push(this.duration[i]);
            this.input.inputs.subEntityDetails[0].subEntity[i].push({'dynamic':this.formList[i].value[keys[j]], 'subId': keys[j]})
          }
        }
        this.payLoad = this.input.inputs
    }

    if(this.showAddMoreEducation){
      let keys  = Object.keys(this.subEntityDetailsForm.value)
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length] = []
      for (let j = 0; j < keys.length; j++) {
        
        if(j==0 && this.duration !==undefined && this.duration.length > 0){
          this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push(this.duration[this.duration.length-1]);
        }
        this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'dynamic':this.subEntityDetailsForm.value[keys[j]], 'subId': keys[j]})
      }
      this.payLoad = this.input.inputs;
    } 

    if(!this.isEntityDisabled){
      this.commetTextArea.commentFormValue()
      this.input.inputs.subEntityDetails[0].subEntity[this.input.inputs.subEntityDetails[0].subEntity.length-1].push({'clarificationComments':this.commetTextArea.commentFormValue()});
    }
    console.log(this.payLoad)
    this.patternDataService.entitySave(this.input).subscribe(res =>{
      this.loading = false;
      this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds,  this.displayName);      
      if(res.status =='failure'){
      // this.message = res.message;
      // this.showSuccessMessage = true;
      this.alertPopService.error(res.message);
      }else if(res.status == "success"){
        if(status == 'Save' && res.status == "success" && res.message == "SUCCESS"){
          this.alertPopService.success(res.Message)
        }
        this.patternDataService.getPatternData(this.candidate.resumeNumber.toString()).subscribe(
          response => {
            // this.input = this.myProfileService.getInput(this.personalDetails, this.accountDetails, this.entityIds,  this.displayName);
            if(status == 'Save & Next' && res.status == "success" && res.message == "SUCCESS"){
              this.router.navigate(['/candidates/my-profile/loa'])
            }
          }
        )
      }
      
    })
  }

  setEntities(entityDetails?){
    if( entityDetails !== undefined){
      entityDetails.forEach(element => {
          this.entitiesList.push(this.service.getEntities(element)) 
      });
    }
  }
  
  onfilesSubmit(){ 
    if(this.personalDetails !== undefined){
      let fileInfo = {
        files: this.files,
        fileName: this.uploadFiles
      }
      this.fileUploadService.fileUpload(fileInfo, this.personalDetails, this.accountDetails).subscribe(
        response => this. onFileUploadSuccess(response),
        error => this.errorHandler(error)
      )
    }
  }


  onFileUploadSuccess(res){

  }

  errorHandler(error){

  }

}
