import { NgModule }  from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { AuthGuard } from './auth-guard.service';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotUserIdComponent } from './forgot-user-id/forgot-user-id.component';
import { AuthLayoutComponent } from './auth-layout.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';



const routes: Routes = [
  
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'privacy-notice', pathMatch: 'full' },
      { path: 'privacy-notice', component: PrivacyNoticeComponent },
      { path: 'login', component: LoginComponent},
      { path: 'registration', component: RegistrationComponent},
      { path: 'forgot/password', component: ForgotPasswordComponent},
      { path: 'forgot/userid', component: ForgotUserIdComponent},       
    ]
  },
];



// export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class AuthRoutingModule {}