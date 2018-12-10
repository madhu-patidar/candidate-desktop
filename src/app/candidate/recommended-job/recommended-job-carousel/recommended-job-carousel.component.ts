import { Component, OnInit, Output } from '@angular/core';
import { NguCarousel } from '@ngu/carousel';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { JobDetailsService } from '../job-details.service';
import { Candidate } from '../../candidate.model';
import { CandidateService } from '../../services/candidate.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recommended-job-carousel',
  templateUrl: './recommended-job-carousel.component.html',
  styleUrls: ['./recommended-job-carousel.component.css'],
  providers: [JobDetailsService]
})
export class RecommendedJobCarouselComponent implements OnInit {

  message: any;
  public carouselOne: NguCarousel;
  @Input() candidate: Candidate;
  @Output()navigateTo = new EventEmitter()
  
  recommendedJobList = []

  constructor(
    private router : Router,
    private jobDetailsService : JobDetailsService,
    private candidateService : CandidateService
  ) { }

  ngOnInit() {
    this.nguCarouselConfig();
    this.candidate = this.candidateService.getCurrentCandidate();
    if(this.candidate){
      this.getRecommendedJobs()
    }
  }

  navigateToJobRecommended(jobCode?){
    let result = {'jobCode':jobCode }
    if(this.navigateTo !== undefined)
      this.navigateTo.emit(result)
    window.scroll(0,0)
    this.router.navigate(['/candidates/recommended-job-details/'+jobCode])
  }

  getRecommendedJobs(){
    let input = {
      "input": {
        "feature": "RECOMMENDED_JOBS",                                       
        "company": "WT",
        "multiple": [
          {
            //TO DO ME
            "filter0": ""
            // "filter0": this.candidate.resumeNumber.toString()
          }
        ]
      }
    }

    this.jobDetailsService.getRecommendedJobs(input).subscribe(
      res => {this.onGetRecommendedJobsSuccess(res.output)},
      error => {this.errorHandler(error)}
    )
  }

  onGetRecommendedJobsSuccess(output){
    if(output['status'] === 'failure'){
      this.message = output.message
    }else if(output['list1']){
      this.recommendedJobList = output.list1
    }
  }

  errorHandler(error){

  }

  nguCarouselConfig(){
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 4, all: 0},
      slide: 1,
      speed: 400,
      interval: 3000,
      animation: 'lazy',
      point: {
        visible: true,
        pointStyles: `
        .ngucarouselPoint {
          list-style-type: none;
          text-align: center;
          padding: 12px;
          margin: 0;
          white-space: nowrap;
          overflow: auto;
          position: absolute;
          width: 100%;
          bottom: -50px;
          left: 0;
          box-sizing: border-box;
          
        }
        .ngucarouselPoint li {
          display: inline-block;
          border-radius: 999px;
          background: #f0f0f0;
          padding: 5px;
          margin: 0 3px;
          transition: .4s ease all;
        }
        .ngucarouselPoint li.active {
            background: #00a1e3;
            width: 10px;
        }
        `
      },
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner',
    }
  }

  public myfunc(event: Event) {
    // carouselLoad will trigger this funnction when your load value reaches
    // it is helps to load the data by parts to increase the performance of the app
    // must use feature to all carousel
 }


}
