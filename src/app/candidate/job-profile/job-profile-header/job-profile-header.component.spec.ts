import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProfileHeaderComponent } from './job-profile-header.component';

describe('JobProfileHeaderComponent', () => {
  let component: JobProfileHeaderComponent;
  let fixture: ComponentFixture<JobProfileHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobProfileHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
