import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth/auth-guard.service';

import { AppComponent } from './app.component';
import { CandidateModule } from './candidate/candidate.module';
import { LocalAuthModule } from './auth/local-auth.module'
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot(
      {maxOpened : 4}
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
