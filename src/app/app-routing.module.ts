import { NgModule, ModuleWithProviders, Component }             from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
const routes: Routes = [
  {
    path: "", redirectTo: 'candidates', pathMatch: 'full',
  },
  {
    path: "auth",
    loadChildren: './auth/local-auth.module#LocalAuthModule'
  },
  {
    path: 'candidates',
    loadChildren: './candidate/candidate.module#CandidateModule'
  },
  {
    path : "not-found", component: NotFoundComponent
  },
  
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, config) ]

})

export class AppRoutingModule {}