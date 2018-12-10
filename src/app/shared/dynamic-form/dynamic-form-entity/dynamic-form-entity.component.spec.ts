import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormEntityComponent } from './dynamic-form-entity.component';

describe('DynamicFormEntityComponent', () => {
  let component: DynamicFormEntityComponent;
  let fixture: ComponentFixture<DynamicFormEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
