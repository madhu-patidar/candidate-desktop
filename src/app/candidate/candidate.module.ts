import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

//Third party packages
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModalModule, BsModalService } from 'ngx-bootstrap';;
import { BsDropdownModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap';
import { UICarouselModule } from "ui-carousel";
import { OwlModule } from 'ngx-owl-carousel';
import { NguCarouselModule } from '@ngu/carousel';
import { UserIdleModule } from 'angular-user-idle';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxUploaderModule } from 'ngx-uploader';
import { AngularFileUploaderModule } from "angular-file-uploader";

//routing module
import { CandidateRoutingModule } from './candidate-routing.module';
import { SharedModule } from '../shared/shared.module';

//services
import { CandidateService } from './services/candidate.service';
import { LocalAuthService } from '../auth/local-auth.service';
import { AuthGuard } from '../auth/auth-guard.service';
import { FileUploadService} from './services/file-upload.service';
import {PatternDataService } from './services/pattern-data.service';
import { CommonMethodsService } from './services/common-method.service';
import { ShareMethodsService } from './../shared/services/share-methods.service';
import { EntityControlService }    from '../shared/dynamic-form/entity-control.service';
import { EntityService } from './../shared/dynamic-form/entity.service';
import { MyProfileService } from './my-profile/my-profile.service';

//components
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecommendedJobDetailsComponent } from './recommended-job/recommended-job-details/recommended-job-details.component';
import { JobBasketComponent } from './job-basket/job-basket.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { InterviewScheduleDetailsComponent } from './job-profile/interview-schedule-details/interview-schedule-details.component';
import { DoItYourselfComponent } from './do-it-yourself/do-it-yourself.component';
import { OfferSalaryStackComponent } from './job-profile/offer/offer-salary-stack.component';
import { NotShortlistedComponent } from './job-profile/not-shortlisted/not-shortlisted.component';
import { FitmentComponent } from './job-profile/fitment/fitment.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ToScreenComponent } from './job-profile/to-screen/to-screen.component';
import { PersonalDetailsComponent } from './my-profile/personal-details/personal-details.component';
import { EducationDetailsComponent } from './my-profile/education-details/education-details.component';
import { SocialMediaComponent } from './social-media/social-media.component';
import { SocialNetworksService } from './services/social-networks.service';
import { VoluntarySelfDeclarationPopComponent } from './my-profile/personal-details/voluntary-self-declaration-pop/voluntary-self-declaration-pop.component';
import { SelfDeclarationPopComponent } from './my-profile/personal-details/self-declaration-pop/self-declaration-pop.component';
import { SpecialAssistanceDeclarationComponent } from './job-profile/interview-schedule-details/special-assistance-declaration/special-assistance-declaration.component';

import { RecommendedJobCarouselComponent } from './recommended-job/recommended-job-carousel/recommended-job-carousel.component';
import { WorkExperienceComponent } from './my-profile/work-experience/work-experience.component';
import { AddressCheckComponent } from './my-profile/address-check/address-check.component';
import { IdentityCheckComponent } from './my-profile/identity-check/identity-check.component';
import { DatabaseCheckComponent } from './my-profile/database-check/database-check.component';
import { LOAComponent } from './my-profile/loa/loa.component';
import { MyProfileHeaderComponent } from './my-profile/my-profile-header/my-profile-header.component';
import { JobProfileComponent } from './job-profile/job-profile.component';
import { HRInterviewComponent } from './job-profile/hr-interview/hr-interview.component';
import { BusinessInterviewComponent } from './job-profile/business-interview/business-interview.component';
import { JobProfileHeaderComponent } from './job-profile/job-profile-header/job-profile-header.component';
import { CommetTextAreaComponent } from './my-profile/commet-text-area/commet-text-area.component';
import { ArrayToStringPipe } from '../shared/pipes/arraytostring.pipe';
import { DrugTestComponent } from './my-profile/drug-test/drug-test.component';
import { CriminalCheckComponent } from './my-profile/criminal-check/criminal-check.component';
import { AlertPopService } from '../shared/components/alert-pop/alert-pop.service';

@NgModule({
  imports: [
    CommonModule,
    CandidateRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    SharedModule,
    CarouselModule.forRoot(),
    UICarouselModule,
    OwlModule,
    NguCarouselModule,
    YoutubePlayerModule,
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120}),
    LoadingModule.forRoot({
      fullScreenBackdrop:true,
      primaryColour: '#03a1e2', secondaryColour: '#03a1e2', tertiaryColour: '#03a1e2'
    }),
    NgxUploaderModule,
    AngularFileUploaderModule,
  ],
  declarations: [
    LayoutComponent, 
    DashboardComponent, 
    RecommendedJobDetailsComponent, 
    JobBasketComponent, 
    ChangePasswordComponent, 
    InterviewScheduleDetailsComponent,
    DoItYourselfComponent, 
    OfferSalaryStackComponent, 
    NotShortlistedComponent, 
    FitmentComponent, 
    MyProfileComponent, 
    ToScreenComponent, 
    PersonalDetailsComponent, 
    EducationDetailsComponent, 
    SocialMediaComponent, 
    VoluntarySelfDeclarationPopComponent, 
    SelfDeclarationPopComponent, 
    SpecialAssistanceDeclarationComponent, 
    RecommendedJobCarouselComponent, 
    WorkExperienceComponent, 
    AddressCheckComponent, 
    IdentityCheckComponent, 
    DatabaseCheckComponent, 
    LOAComponent, 
    MyProfileHeaderComponent, 
    JobProfileComponent, 
    HRInterviewComponent, 
    BusinessInterviewComponent, 
    JobProfileHeaderComponent, CommetTextAreaComponent, DrugTestComponent, CriminalCheckComponent
  ],
  
  providers: [BsModalService, 
    CandidateService, 
    LocalAuthService, 
    AuthGuard, 
    FileUploadService,
    PatternDataService,
    SocialNetworksService,
    CommonMethodsService,
    ShareMethodsService,
    EntityControlService,
    EntityService,
    DatePipe,
    ArrayToStringPipe,
    MyProfileService,
    AlertPopService
  ]
})
export class CandidateModule { }
