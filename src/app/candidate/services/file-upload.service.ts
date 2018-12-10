import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, } from '@angular/common/http';
import { HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/Rx';

import { 
  UPLOAD_PHOTO_URL,
  GET_PHOTO_URL,
  FILE_UPLOAD_URL
 } from './../../apis.constant'

@Injectable()
export class FileUploadService {
  private _window: Window;
  headers:any;
  timestamp:number = new Date().getTime();

  constructor(
    private http : HttpClient,
  ) {
    this.headers = new HttpHeaders()
    .set('Username', 'Mzg2MQ==')
    .set('Password', 'Mzg2MQ==')
    .set('Content-Type', 'multipart/form-data')
   }

  imageUpload(file, candidate){
  //  let  formdata = { file:imageInfo.file, companyCode: 'WT', moduleType:'lateral', resumeNumber:candidate.resumeNumber}
    let formData = new FormData();
    formData.append("file", file);
    formData.append("companyCode",'WT');
    formData.append("moduleType", 'lateral');
    formData.append("resumeNumber", candidate.resumeNumber.toString());
    return this.http.post(UPLOAD_PHOTO_URL, formData).map( (response: Response) => {
      return response
    })
  }

  fileUpload(fileInfo?, candidate?, account?){
    // let  formdata = { file:fileInfo.file, companyCode: 'WT', moduleType:'lateral', resumeNumber:candidate.resumeNumber}
    // let formData = {file :fileInfo.files  ,companyCode:'WT' , moduleType: 'lateral', fileName:fileInfo.fileName,userId:'547491','resumeNumber': candidate.resumeNumber , masterId:"",entityDataId:"",sequenceNo:"1",finalReportUpload:false, page:'Y' }

    let formData = new FormData();
    // formData.append("file", fileInfo.file);
    // formData.append("companyCode",'WT');
    // formData.append("moduleType", 'lateral');
    // formData.append("resumeNumber", candidate.resumeNumber.toString());
    // formData.append("fileName", fileInfo.fileName);
    // formData.append("userId", candidate.resumeNumber.toString());
    // formData.append("masterId", account.masterId.toString());
    // formData.append("entityDataId", fileInfo.fileInfo.entityDataId.toString());
    // formData.append("sequenceNo", fileInfo.fileInfo.sequenceId.toString());
    // formData.append("finalReportUpload",'false');
    formData.append("filekey", fileInfo);

     return this.http.post(FILE_UPLOAD_URL, formData, {headers : this.headers}).map( (response: Response) => {
       return response
     })
   }

  getProfilePicture(imageInfo?){
    return this.http.get(GET_PHOTO_URL + 'WT/lateral/547785' )
    .map( response => { return response}
    )
  }

  downloadFile(){
    let response :any;
    return this.http.get('https://appstore.wipro.com/iverify/DownloadFileServlet?Operation=DownloadAuthorizationLetter&newIverifyFlag=Y&CompanyCode=WT&fName=LetterOfAuthorization.PDF&fType=pdf').map(res => {
      return response = res;
    })
  }

  downloadLOA(LOAFileName?){
    this.http.get("https:appstore.wipro.com/iverify/DownloadFileServlet?Operation=DownloadAuthorizationLetter&newIverifyFlag=Y&CompanyCode=WT&fName="+LOAFileName+"&fType=pdf", { responseType: "blob" }).subscribe(res => {
      let options = { type: 'application/html' };
      this.downloadFiles(res, options, LOAFileName);
    });
  }
  
 downloadFiles(response, options, filename) {
        var blob = new Blob([response], options);
        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, filename);
        }
        else {
            var link = document.createElement('a');
            // Browsers that support HTML5 download attribute
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        }

    }

  handleError(error: Response) { 
    return Observable.throw(error);
  }


}
