import { NgModule }  from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { AuthGuard } from '../auth/auth-guard.service';

import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecommendedJobDetailsComponent } from './recommended-job/recommended-job-details/recommended-job-details.component';
import { JobBasketComponent } from './job-basket/job-basket.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { InterviewScheduleDetailsComponent } from './job-profile/interview-schedule-details/interview-schedule-details.component';
import { DoItYourselfComponent } from './do-it-yourself/do-it-yourself.component';
import { OfferSalaryStackComponent } from './job-profile/offer/offer-salary-stack.component';
import { NotShortlistedComponent } from './job-profile/not-shortlisted/not-shortlisted.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { FitmentComponent } from './job-profile/fitment/fitment.component';
import { ToScreenComponent } from './job-profile/to-screen/to-screen.component';
import { PersonalDetailsComponent } from './my-profile/personal-details/personal-details.component';
import { EducationDetailsComponent } from './my-profile/education-details/education-details.component';
import { WorkExperienceComponent } from './my-profile/work-experience/work-experience.component';
import { AddressCheckComponent } from './my-profile/address-check/address-check.component';
import { IdentityCheckComponent } from './my-profile/identity-check/identity-check.component';
import { DatabaseCheckComponent } from './my-profile/database-check/database-check.component';
import { LOAComponent } from './my-profile/loa/loa.component';
import { JobProfileComponent } from './job-profile/job-profile.component';
import { HRInterviewComponent } from './job-profile/hr-interview/hr-interview.component';
import { BusinessInterviewComponent } from './job-profile/business-interview/business-interview.component';
import { DrugTestComponent } from './my-profile/drug-test/drug-test.component';
import { CriminalCheckComponent } from './my-profile/criminal-check/criminal-check.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: DashboardComponent},
      { path: 'recommended-job-details', component: RecommendedJobDetailsComponent, canActivateChild: [AuthGuard] },
      { path: 'recommended-job-details/:id', component: RecommendedJobDetailsComponent, canActivateChild: [AuthGuard] },
      { path: 'Job-basket', component: JobBasketComponent, canActivateChild: [AuthGuard] },
      { path: 'change-password', component: ChangePasswordComponent, canActivateChild: [AuthGuard] },
      { path: 'do-it-yourself', component: DoItYourselfComponent, canActivateChild: [AuthGuard] },
      { path: 'job-profile', component: JobProfileComponent, canActivateChild: [AuthGuard] },
      { path: 'job-profile/interview-schedule-details', component: InterviewScheduleDetailsComponent, canActivateChild: [AuthGuard] },
      { path: 'job-profile/hr-interview', component: HRInterviewComponent, canActivateChild: [AuthGuard] },
      { path: 'job-profile/to-screen', component: ToScreenComponent, canActivateChild: [AuthGuard] },      
      { path: 'job-profile/offer', component: OfferSalaryStackComponent, canActivateChild: [AuthGuard] },
      { path: 'job-profile/screened', component: NotShortlistedComponent, canActivateChild: [AuthGuard] },
      { path: 'job-profile/business-interview', component: BusinessInterviewComponent, canActivateChild: [AuthGuard] },
      { path: 'job-profile/fitment', component: FitmentComponent, canActivateChild: [AuthGuard] },
      { path: 'my-profile', component: MyProfileComponent, canActivateChild: [AuthGuard] },
      { path: 'my-profile/personal-details', component: PersonalDetailsComponent, canActivateChild: [AuthGuard],runGuardsAndResolvers: 'always', },
      { path: 'my-profile/education-details', component: EducationDetailsComponent, canActivateChild: [AuthGuard] },
      { path: 'my-profile/work-experience', component: WorkExperienceComponent, canActivateChild: [AuthGuard] },
      { path: 'my-profile/address-check', component: AddressCheckComponent, canActivateChild: [AuthGuard] },
      { path: 'my-profile/identity-check', component: IdentityCheckComponent, canActivateChild: [AuthGuard] },
      { path: 'my-profile/database-check', component: DatabaseCheckComponent, canActivateChild: [AuthGuard] },
      { path: 'my-profile/criminal-check', component: CriminalCheckComponent, canActivateChild: [AuthGuard] },
      { path: 'my-profile/drug-test', component: DrugTestComponent, canActivateChild: [AuthGuard] },
      { path: 'my-profile/loa', component: LOAComponent, canActivateChild: [AuthGuard] },
    ]
  }
];



// export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class CandidateRoutingModule {}