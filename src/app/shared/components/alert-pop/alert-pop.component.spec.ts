import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertPopComponent } from './alert-pop.component';

describe('AlertPopComponent', () => {
  let component: AlertPopComponent;
  let fixture: ComponentFixture<AlertPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertPopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
