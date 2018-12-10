import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewScheduleDetailsComponent } from './interview-schedule-details.component';

describe('InterviewScheduleDetailsComponent', () => {
  let component: InterviewScheduleDetailsComponent;
  let fixture: ComponentFixture<InterviewScheduleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewScheduleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewScheduleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
