import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedJobDetailsComponent } from './recommended-job-details.component';

describe('RecommendedJobDetailsComponent', () => {
  let component: RecommendedJobDetailsComponent;
  let fixture: ComponentFixture<RecommendedJobDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedJobDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
