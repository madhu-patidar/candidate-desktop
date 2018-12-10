import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugTestComponent } from './drug-test.component';

describe('DrugTestComponent', () => {
  let component: DrugTestComponent;
  let fixture: ComponentFixture<DrugTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
