import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBasketComponent } from './job-basket.component';

describe('JobBasketComponent', () => {
  let component: JobBasketComponent;
  let fixture: ComponentFixture<JobBasketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobBasketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
