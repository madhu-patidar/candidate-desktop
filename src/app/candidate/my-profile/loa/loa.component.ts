import { Component, OnInit, EventEmitter } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { Candidate } from '../../candidate.model';

import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { CandidateService } from '../../services/candidate.service';
import { PatternDataService } from '../../services/pattern-data.service';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { LOA_DOCUMENT_UPLOAD_URL } from '../../../apis.constant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-loa',
  templateUrl: './loa.component.html',
  styleUrls: ['./loa.component.css']
})
export class LOAComponent implements OnInit {

  personalDetails: any;
  checked : boolean = false;
  @ViewChild('checkBox1')checkBox : ElementRef;
  
  messgae: any;
  hasError: boolean;
  accountDetails: any;
  candidate: Candidate;
  uploadFiles: string = 'Upload letter of authorization';
  
  options: UploaderOptions = { concurrency: 1, maxUploads: 100 };
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  loading:boolean;

  fileListArray = []
  screenNumber: any;

  input = {"inputs":{"companyCode":"WT","userId":"547491","moduleType":"lateral","userLevel":"12","division":"DV2","subDivision":"SD24","accountCode":"AC320","location":"BLR","countryCode":"IND","emailid":"a27@gmail.com","lastname":"KUMAR","firstname":"SREEJITHA","noOfEmpl":"3","typecheck":"TC230","DOB":"07-03-1991","submittedValue":"Submit","status":"NEW","bgv1Status":"CREATED","bgv2Status":"CREATED","candidateName":"SREEJITHA KUMAR","resumeNumber":"547491","gapDetails":[],"loaFileArray":["14261"],"workExp":10,"relWorkExp":0}}
  
  constructor(
    private fileUploadService :FileUploadService,
    private candidateService : CandidateService,
    private patternDataService : PatternDataService,
    private datePipe : DatePipe
  ) { 
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }


  setInput(){
    this.input.inputs.userId = this.personalDetails.resumeNumber;
    this.input.inputs.resumeNumber = this.personalDetails.resumeNumber;
    this.input.inputs.location = this.personalDetails.locationCode.toString();
    this.input.inputs.accountCode = this.accountDetails.accountCode;
    this.input.inputs.division = this.accountDetails.division;
    this.input.inputs.typecheck =  this.accountDetails.typeOfCheck;
    this.input.inputs.subDivision = this.accountDetails.subDivision;
    this.input.inputs.countryCode = this.accountDetails.countryCode;
    this.input.inputs.emailid = this.personalDetails.mailId;
    this.input.inputs.firstname = this.personalDetails.firstName;
    this.input.inputs.lastname = this.personalDetails.lastName;
    this.input.inputs.workExp = this.personalDetails.workExp.toString();
    this.input.inputs.relWorkExp = this.personalDetails.relevantWorkExp.toString();
    //noOfEmpl
    this.input.inputs.DOB = this.datePipe.transform(this.personalDetails.dob, 'dd-MM-yyyy'),
    this.input.inputs.noOfEmpl = this.personalDetails.workedCompanies.toString();//noOfEmpl
    this.input.inputs.bgv1Status = 'CREATED'
    //JSON.stringify(this.personalDetails.bgv1_sub_status) === '{}' ? 'SAVED' : this.personalDetails.bgv1_sub_status;
    this.input.inputs.bgv2Status = 'CREATED'
    //JSON.stringify(this.personalDetails.bgv2_sub_status) === '{}' ? 'SAVED' : this.personalDetails.bgv2_sub_status;
    this.input.inputs.candidateName = this.input.inputs.firstname + ' ' +this.input.inputs.lastname
    //

    this.patternDataService.finalSubmission(this.input).subscribe(res =>{
      res;
    })
  }

  ngOnInit() {
   
    this.candidate = this.candidateService.getCurrentCandidate();
    this.accountDetails = this.patternDataService.getAccountDetails();
    this.personalDetails =this.patternDataService.getPersonalDetails();
    let patternData = JSON.parse(localStorage.getItem('patternData'));
    this.screenNumber = patternData.length + 1;
  //   this.uploader.onSuccess.subscribe(
  //     (data: any) => {
  //         console.log(`upload file successful:  ${data.item} ${data.body} ${data.status} ${data.headers}`);

  //     }
  // );
  }

  onClick(){
    this.checked = this.checkBox.nativeElement.checked;
  }

  downloadLOA(fileName?){
    this.fileUploadService.downloadLOA(this.personalDetails.LOAFileName);
  }  


  onSubmit(){
    this.startUpload();
  }


  onUploadOutput(output: UploadOutput): void {
    if(output.type === 'start')
      this.loading = true;
    if(output.type === 'done'){
      this.loading = false;
      this.setInput();
    }
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'rejected'  && typeof output.file !== 'undefined') { // add file to array when added
      this.files[0] = output.file;
      // this.files.push(output.file);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      // this.files.push(output.file);
      this.files[0] = output.file;
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



  startUpload(): void {
    if(this.files && this.files.length > 0){
      for (let index = 0; index < this.files.length; index++) {
        const event3: UploadInput = {
          type: 'uploadFile',
          url: LOA_DOCUMENT_UPLOAD_URL,
          method: 'POST',
          file: this.files[index],
         data: { companyCode:'WT',moduleType:'lateral',fileName: this.files[0].name ,userId:this.candidate.resumeNumber.toString(), resumeNumber:this.candidate.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId:"", sequenceNo:"", finalReportUpload:"false",page:'Y' }
          };
        this.uploadInput.emit(event3);
        }
    }
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

  download(){

    this.fileUploadService.downloadFile().subscribe(data => this.downloadFile(data)),//console.log(data),
                  error => console.log("Error downloading the file."),
                  () => console.info("OK");
  }

  downloadFile(url: any){
    // var blob = new Blob([data], { type: 'text/csv' });
    // var url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  }

