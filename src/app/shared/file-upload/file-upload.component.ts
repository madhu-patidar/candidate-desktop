
import { Component, Input, OnInit, EventEmitter}  from '@angular/core';
import { FormGroup }                 from '@angular/forms';

import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';


import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import { Router } from '@angular/router';
import { PatternDataService } from '../../candidate/services/pattern-data.service';
import { CandidateService } from '../../candidate/services/candidate.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  loading: boolean;
  options: UploaderOptions = { concurrency: 1, maxUploads: 1 };
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  @Input() accountDetails:any;
  @Input() personalDetails:any;
  @Input() fileName:string;
  @Input() fileDetails:any;

  constructor(
    private patternDataService : PatternDataService,
    private candidateService : CandidateService,
    private router : Router,
  ) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    
  }
  
  onUploadOutput(output: UploadOutput, fileDetails): void {
    if(output.type == 'start')
      this.loading = true

    if(output.type == 'rejected')
      this.files[0] = output.file;
    if(output.type == 'done'){
      // this.patternDataService.getFreshPatterData("547491");
      this.loading = false;
      this.ngOnInit();
      
      // this.files[0] = <any>[]
    }
      

    if(output.type == 'addedToQueue')
      this.files[0] = output.file;

    if(output.type === 'allAddedToQueue' && output.file == undefined && this.files[0] !== undefined){
      let sequenceId = fileDetails === undefined  && fileDetails.sequenceId === undefined ? "" : fileDetails.sequenceId.toString();
      let entityDataId = fileDetails === undefined  && fileDetails.sequenceId === undefined ? "" : fileDetails.entityDataId.toString();;
      const event: any = {
        type: 'uploadAll',
        url: 'https://appstore.wipro.com/iverify/rest/uploadService/uploadFile',
        method: 'POST',
        data: {file: this.files[0], companyCode:'WT',moduleType:'lateral',fileName: this.files[0].name ,userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId:entityDataId, sequenceNo:sequenceId, finalReportUpload:false,page:'Y' }
      };
      this.uploadInput.emit(event)
    }
    if ((output.type === 'allAddedToQueue' || output.type === 'addedToQueue' ) && output.file !== undefined ) { 
      let sequenceId = fileDetails === undefined ? "" : fileDetails.sequenceId.toString();
      let entityDataId = fileDetails === undefined ? "" : fileDetails.entityDataId.toString();;
      const event: any = {
        type: 'uploadAll',
        url: 'https://appstore.wipro.com/iverify/rest/uploadService/uploadFile',
        method: 'POST',
        data: {file: output.file, companyCode:'WT',moduleType:'lateral',fileName: output.file.name ,userId:this.personalDetails.resumeNumber.toString(), resumeNumber:this.personalDetails.resumeNumber.toString(), masterId:this.accountDetails.masterId.toString(), entityDataId:entityDataId, sequenceNo:sequenceId, finalReportUpload:false,page:'Y' }
      };
      this.uploadInput.emit(event); 
    }
  }

  startUpload(): void {
      const event: any = {
        type: 'uploadAll',
        url: 'https://appstore.wipro.com/iverify/rest/uploadService/uploadFile',
        method: 'POST',
        data: {file: this.files, companyCode:'WT',moduleType:'lateral',fileName:this.files[0].name ,userId:'547491',resumeNumber:'547491',masterId:'19678',entityDataId:'26121',sequenceNo:'1'.toString() ,finalReportUpload:false,page:'Y' }
      };
      // event.file.forEach(element => {
      //   let e = JSON.parse(JSON.stringify(event))
      //   e.file = element
        this.uploadInput.emit(event);
      // });

  
   
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

    reader.readAsDataURL(file);
  });
}