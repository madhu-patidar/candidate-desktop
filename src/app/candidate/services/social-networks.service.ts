import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, } from '@angular/common/http';
import { HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import { 
  YOUTUBE_FEEDS_URL,
  TWITTER_FEEDS_URL,
  FACEBOOK_FEEDS_URL
 } from '../../apis.constant';




@Injectable()
export class SocialNetworksService {
  youTubeFeeds:any;
  facebookFeeds:any;
  twitterFeeds:any;
  constructor(
    private http : HttpClient,
  ) { }

  FB_TW_SOCIAL_API = 'http://13.67.57.91/fbtw-socialapi.aspx'



  getSocailFeed(){
    let response : any;
    return this.http.get(this.FB_TW_SOCIAL_API)
    .map(res => {
      response = res;
      return response;
    });
  }

  getYouTubeFeed(){
    let response : any;
    return this.http.get(YOUTUBE_FEEDS_URL)
    .map(res => {
      response = res;
      this.youTubeFeeds = res;
      return response;
    });
  }

  getFacebookFeed(){
    let response : any;
    return this.http.get(FACEBOOK_FEEDS_URL)
    .map(res => {
      response = res;
      this.facebookFeeds = res;
      return response;
    });
  }

  getTwitterFeed(){
    let response : any;
    return this.http.get(TWITTER_FEEDS_URL)
    .map(res => {
      response = res;
      this.twitterFeeds = res;
      return response;
    });
  }
}
