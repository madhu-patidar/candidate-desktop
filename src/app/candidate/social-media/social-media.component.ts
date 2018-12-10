import { Component, OnInit, Input, AfterViewInit} from '@angular/core';
import { SocialNetworksService } from '../services/social-networks.service';
import { DomSanitizer } from '@angular/platform-browser';

import { NguCarousel } from '@ngu/carousel';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { CarouselComponent } from 'ngx-bootstrap';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css']
})
export class SocialMediaComponent implements OnInit {

  twitterFeedList:any = [];
  facebookFeedList:any = [];
  youTubeFeedList:any =[];
  public carouselOne: NguCarousel;
  player: YT.Player;
  private id: string;
 

  fbUrl = 'https://www.facebook.com/wiprocareers';
  twitterUrl = location.href;

  @ViewChild('carousel') carousel: CarouselComponent;
  
  constructor(
    private socialNetworksService : SocialNetworksService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {
    const url1 = 'https://platform.twitter.com/widgets.js';
    if (!document.querySelector(`script[src='${url1}']`)) {
        let script = document.createElement('script');
        script.src = url1;
        document.body.appendChild(script);
    }
   }


  ngOnInit() {
    window['twttr'] && window['twttr'].widgets.load();
    this.nguCarouselConfig();
    this.getFacebookFeed()
    this.getYouTubeFeed();
    this.getTwitterFeed();

  }

  public myfunc(event: Event) {
    // carouselLoad will trigger this funnction when your load value reaches
    // it is helps to load the data by parts to increase the performance of the app
    // must use feature to all carousel
 }

 nguCarouselConfig(){
  this.carouselOne = {
    grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
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
    touch: false,
    loop: true,
    custom: 'banner',
  }
}


  setPlay(): void {
      this.carousel.play();
  }
  setPause(): void {
      this.carousel.noPause = false;
      this.carousel.pause();
  }


  getSocialFeed(){
    this.socialNetworksService.getSocailFeed().subscribe(res =>{
      this.succcessGetSocialFeed(res);
    },
    error => {
      this.errorHandler(error)
    })
  }

  succcessGetSocialFeed(response:any){
    // this.twitterFeedList = response[0].twList;
    this.facebookFeedList = response[0].fbList;
  }

  getTwitterFeed(){
    this.socialNetworksService.getTwitterFeed().subscribe(res =>{
      this.succcessGetTwitterFeed(res.data);
    },
    error => {
      this.errorHandler(error)
    })
  }

  succcessGetTwitterFeed(tweeterFeeds){
    tweeterFeeds = tweeterFeeds.sort((a, b) => a.sequence - b.sequence);
    let twitterFeedList = tweeterFeeds
    let max = 5
    for (var _i = 0; _i < twitterFeedList.length; _i++) {
      if(!twitterFeedList[_i]['url']){
        max ++
      }
      if(_i < max && twitterFeedList[_i]['url'] ){
        this.twitterFeedList.push(twitterFeedList[_i]);
      }
    }
  }

  getFacebookFeed(){
    this.socialNetworksService.getFacebookFeed().subscribe(res =>{
      this.succcessGetFacebookFeed(res.data);
    },
    error => {
      this.errorHandler(error)
    })
  }

  succcessGetFacebookFeed(facebookFeeds){
    facebookFeeds = facebookFeeds.sort((a, b) => a.sequence - b.sequence)
    let facebookFeedList = facebookFeeds;
    let max = 5
    for (var _i = 0; _i < facebookFeedList.length; _i++) {
      if(!facebookFeedList[_i]['url']){
        max ++
      }
      if(_i < max && facebookFeedList[_i]['url'] ){
        this.facebookFeedList.push(facebookFeedList[_i]);
      }
    }
  }

  getYouTubeFeed(){
    this.socialNetworksService.getYouTubeFeed().subscribe(res =>{
      this.succcessGetYouTubeFeed(res.data);
    },
    error => {
      this.errorHandler(error)
    })
  }

  succcessGetYouTubeFeed(youTubeFeeds){
    youTubeFeeds = youTubeFeeds.sort((a, b) => a.sequence - b.sequence);
    let youTubeFeedList = youTubeFeeds;

    for (var _i = 0; _i < youTubeFeedList.length; _i++) {
      if(_i < 5){
        this.youTubeFeedList.push(youTubeFeedList[_i]);
      }
    }
  }

  errorHandler(error){
    console.log(error)
  }

  dateFormat(date){
    return moment(date).format('MMMM DD');
  }

  getIFrameUrl(url){
    let iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    return iframeUrl
  }

  navigateToJobRecommended(){
    this.router.navigate(['/candidates/recommended-job-details'])
  }

  savePlayer(player) {
    this.player = player;
  }
  
  onStateChange(event) {
    if(event.data == 1)
      this.carousel.pause();
    else 
    this.carousel.play();    
  }

  getEmbedId(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return match[7]
  }
}
