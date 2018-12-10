import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


//Third party packages
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModalModule, BsModalService } from 'ngx-bootstrap';
import { UICarouselModule } from "ui-carousel";
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxCarouselModule } from 'ngx-carousel';


//routing module
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';

//services
import { LocalAuthService } from './local-auth.service';
import { AuthGuard } from './auth-guard.service';

//components
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotUserIdComponent } from './forgot-user-id/forgot-user-id.component';
import { AuthLayoutComponent } from './auth-layout.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';



@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ModalModule.forRoot(),
    UICarouselModule,
    BsDropdownModule.forRoot(),
    NgxCarouselModule,
    SharedModule
    
  ],
  declarations: [  
    LoginComponent, 
    RegistrationComponent, 
    ForgotPasswordComponent, 
    ForgotUserIdComponent, 
    AuthLayoutComponent, PrivacyNoticeComponent,
  ],
  providers: [BsModalService, LocalAuthService, AuthGuard]
})
export class LocalAuthModule { }
