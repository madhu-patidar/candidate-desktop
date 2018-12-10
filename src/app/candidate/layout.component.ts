import { Component, OnInit } from '@angular/core';

import { UserIdleService } from 'angular-user-idle';

import { ChangePasswordService } from './change-password/change-password.service';
import { ActivatedRoute } from '@angular/router';
import { CandidateService } from './services/candidate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers:[ChangePasswordService]
})
export class LayoutComponent implements OnInit {

  routerLoad : boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userIdle: UserIdleService,
    private changePasswordService : ChangePasswordService,
    public candidateService : CandidateService,
    private router: Router,
  ) { }

  ngOnInit() {

    let token = this.activatedRoute.snapshot.queryParams["token"]
    if(token != undefined || token != null)
      this.changePasswordService.getAuthToken(token).subscribe(res =>{this.getCandidateDetails(res.ResumeNumber)});
    else{
      this.routerLoad = true
    }
    this.userIdle.setConfigValues({idle: 1200, timeout: 1000, ping: 600})
    this.userIdle.startWatching();
    
    //Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => {});
    
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() =>{});

    this.userIdle.ping$.subscribe(() =>this.changePasswordService.getRefreshToken().subscribe(
      res =>{this.getCandidateDetails(res.ResumeNumber)}
    ));

 //TO DO ME
this.getCandidateDetails("503028")
// this.getCandidateDetails("547781")
// this.getCandidateDetails("541554")
// this.getCandidateDetails("547277")
  }

  onActivate(event) {
    window.scroll(0,0);
  }
  onClick(){
    // alert('akskjsakd')
  }

  getCandidateDetails(resumeNumber){
    let input = {
      "input": {
        "feature": "CANDIDATE_DETAILS","company": "WT",
        "multiple": [
          {          
            "filter0": resumeNumber.toString()
          }
        ]
      }
    }
    this.candidateService.getCandidateDetails(input).subscribe(response =>{
      this.successCandidateDetails(response.output)
    },
    error => { this.errorHandler(error) }
    )
  }

  successCandidateDetails(response){
    this.routerLoad = true;
    if(!localStorage.getItem('reload')){
      localStorage.setItem('reload', 'true')
      this.router.navigate(['/candidates/dashboard'])
    }
  }

  errorHandler(error){
    console.log(error)
  }


}
