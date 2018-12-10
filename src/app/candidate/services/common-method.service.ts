import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  constructor() { }

  bodyScrollable(){
    document.getElementById("body").style.overflow = "visible";
  }

  bodyUnscrollable(){
    document.getElementById("body").style.overflow = "hidden";
  }
}
