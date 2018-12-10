import { Component, OnInit, Input } from '@angular/core';
import { CandidateService } from '../../services/candidate.service';
import { GET_PHOTO_URL } from '../../../apis.constant';
import { FileUploadService } from '../../services/file-upload.service';
import { PatternDataService } from '../../services/pattern-data.service';

@Component({
  selector: 'app-my-profile-header',
  templateUrl: './my-profile-header.component.html',
  styleUrls: ['./my-profile-header.component.css']
})
export class MyProfileHeaderComponent implements OnInit {

  candidateDetails: any;
  profilePicUrl = GET_PHOTO_URL + 'WT/lateral/';
  personalDetails : any
  @Input()screenNumber:number = 7; 
  loading: boolean;
  patternData: any;
  displayEntity: any;
  activeUrl;
  
  constructor(
    private candidateService : CandidateService,
    private fileUploadService : FileUploadService,
    private patternDataService : PatternDataService,
  ) {
    this.activeUrl = {
      'DIS1' : 'education-details',
      'DIS2' : 'work-experience',
      'DIS3' : 'address-check',
      'DIS4' : 'criminal-check',
      'DIS5' : 'drug-test',
      'DIS6' : '',
      'DIS7' : '',
      'DIS8' : 'identity-check',
      'DIS9' : '"database-check',
    }
   }

  getActiveUrl(key){
    return this.activeUrl[key];
  }
  ngOnInit() {
    this.getCandidateDetails();
    this.personalDetails = this.patternDataService.getPersonalDetails();
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
        //  this.message = response.output.Message;
       }else if(JSON.stringify(response.output) === "{}"){
         this.loading = false;
        //  this.router.navigate(['/not-found'])
       }else{
         this.patternData = response.output;
         this.displayEntity = this.patternData.displayEntity
       }
     }else if(response.status === 'failure'){
      //  this.message = response.output.message;
     }
   } 

   errorHandler(error){

   }

  getCandidateDetails(){
    this.candidateDetails = this.candidateService.getCurrentCandidate();
    if(JSON.parse(localStorage.getItem('patternData'))){
      this.patternData = JSON.parse(localStorage.getItem('patternData'));
      this.displayEntity = this.patternData.displayEntity;
    }else{
      this.getPatternData(this.candidateDetails.resumeNumber.toString())
    }
   
  }

  getProfilePic(){
    if(this.candidateDetails !== undefined){
      return this.profilePicUrl 
      + this.candidateDetails.resumeNumber +  "?timestamp="  + this.fileUploadService.timestamp;
      // +  "547785" + "?timestamp="  + this.fileUploadService.timestamp;
    }else return  'assets/images/profile-photo.png'
  }

}
