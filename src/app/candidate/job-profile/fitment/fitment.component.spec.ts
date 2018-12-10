import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FitmentComponent } from './fitment.component';

describe('FitmentComponent', () => {
  let component: FitmentComponent;
  let fixture: ComponentFixture<FitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
