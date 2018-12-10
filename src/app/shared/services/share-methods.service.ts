import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareMethodsService {

  public subject = new Subject<any>();

  candidate$ = this.subject.asObservable();
  
  constructor() { }

  bodyScrollable(){
    document.getElementById("body").style.overflow = "visible";
  }

  bodyUnscrollable(){
    document.getElementById("body").style.overflow = "hidden";
  }

  sendCandidate(candidate:any) {
      this.subject.next(candidate);
  }

  

  
}
