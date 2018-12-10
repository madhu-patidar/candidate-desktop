import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userIdField:boolean = false;
  passwordField:boolean = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  onKey(value){
    if(value !== "" ){
      this.userIdField=true;
    }else{     
      this.userIdField=false;
    }
  }

  onKeyPassword(value){
    if(value !== "" ){
      this.passwordField=true;
    }else{     
      this.passwordField=false;
    }
  }

  onLogin(){
    this.router.navigate(['/candidates/dashboard'])
  }
  
}
