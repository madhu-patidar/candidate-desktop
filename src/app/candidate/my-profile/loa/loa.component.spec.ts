import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LOAComponent } from './loa.component';

describe('LOAComponent', () => {
  let component: LOAComponent;
  let fixture: ComponentFixture<LOAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LOAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LOAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
