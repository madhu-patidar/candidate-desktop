import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSalaryStackComponent } from './offer-salary-stack.component';

describe('OfferSalaryStackComponent', () => {
  let component: OfferSalaryStackComponent;
  let fixture: ComponentFixture<OfferSalaryStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferSalaryStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferSalaryStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
