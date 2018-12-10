import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './components/footer/footer.component';
import { AuthHeaderComponent } from './components/auth-header/auth-header.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CandidateRoutingModule } from '../candidate/candidate-routing.module';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { EntityControlService } from './dynamic-form/entity-control.service';
import { EntityService } from './dynamic-form/entity.service';
import { DynamicFormEntityComponent } from './dynamic-form/dynamic-form-entity/dynamic-form-entity.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ShareMethodsService } from './services/share-methods.service';
// import { FileUploadService } from './file-upload/file-upload.service';
import { SafePipe } from './pipes/safe.pipe';
import { NewlinePipe } from './pipes/newline.pipe';
import { ArrayToStringPipe } from './pipes/arraytostring.pipe';
import { DatePipe } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { LoadingModule } from 'ngx-loading';
import { FileUploadService } from '../candidate/services/file-upload.service';

import { BsDropdownModule } from 'ngx-bootstrap';
import { AlertPopComponent } from './components/alert-pop/alert-pop.component';
import { AlertPopService } from './components/alert-pop/alert-pop.service';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUploaderModule,
    BsDropdownModule.forRoot(),
    LoadingModule.forRoot({
      fullScreenBackdrop:true,
      primaryColour: '#03a1e2', secondaryColour: '#03a1e2', tertiaryColour: '#03a1e2'
    }),
  ],
  declarations: [
    FooterComponent, 
    AuthHeaderComponent, 
    HeaderComponent, 
    LoaderComponent,
    DynamicFormEntityComponent,
    SafePipe,
    NewlinePipe,
    ArrayToStringPipe,
    NotFoundComponent,
    FileUploadComponent,
    AlertPopComponent
  ],
  providers: [
    ShareMethodsService,
    FileUploadService,
    AlertPopService
  ],
  exports: [
    FooterComponent, 
    AuthHeaderComponent, 
    HeaderComponent,
    LoaderComponent,
    DynamicFormEntityComponent,
    SafePipe,
    NewlinePipe,
    DatePipe,
    ArrayToStringPipe,
    NotFoundComponent,
    FileUploadComponent,
    AlertPopComponent
]
})
export class SharedModule { }
