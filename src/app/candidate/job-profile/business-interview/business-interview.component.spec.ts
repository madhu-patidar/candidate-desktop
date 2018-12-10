import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInterviewComponent } from './business-interview.component';

describe('BusinessInterviewComponent', () => {
  let component: BusinessInterviewComponent;
  let fixture: ComponentFixture<BusinessInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
