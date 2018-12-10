import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, } from '@angular/common/http';
import { HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';

import { 
  GET_AUTH_TOKEN,
  CHANGE_PASSWORD_URL
} from '../../apis.constant';


@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  headers : HttpHeaders;

  constructor(
    private http : HttpClient,
  ) {
    this.headers = new HttpHeaders()
    .set('Username', 'MTAwMDE=')
    .set('Password', 'd2lwcm9AMTIz')
    .set('Content-Type', 'application/x-www-form-urlencoded')
   }

  getAuthToken(refreshToken){
    let body = `grant_type=refresh_token&client_id=onboardingPortal&refresh_token=${refreshToken}`
   return this.http.post(GET_AUTH_TOKEN, body, {headers: this.headers}).map(this.extractData).catch(this.handleError);
  }

  getRefreshAuthToken(refreshToken){
    let body = `grant_type=refresh_token&client_id=onboardingPortal&refresh_token=${refreshToken}`
   return this.http.post(GET_AUTH_TOKEN, body, {headers: this.headers}).map(this.extractData).catch(this.handleError);
  }

  setAuth(res){
    localStorage.setItem('authentication', JSON.stringify(res))
  }

  getAuth(){
    return JSON.parse(localStorage.getItem('authentication'));
  }

  extractData(res: Response) {
    localStorage.setItem('authentication', JSON.stringify(res))
    let response:any = res;
    return response;
  }

  changePassword(input){
    let auth = this.getAuth()
    let headers = new HttpHeaders()
    .set('Authorization', auth.token_type + ' ' + auth.access_token)
    .set('Content-Type', 'application/json')

    return this.http.post(CHANGE_PASSWORD_URL, input, {headers: headers}).map(res =>{
      let response : any = res;
      return response;
    })
  }

  private handleError(error: any) {
    return Observable.throw(error);
  }


  getRefreshToken(){
    let auth = this.getAuth();
    let input = {
      grant_type : 'refresh_token',
      client_id :  auth.refresh_token,
      refresh_token : auth.refresh_token
    }
    let response:any =  this.getRefreshAuthToken(auth.refresh_token)
    return response;
  }

}
