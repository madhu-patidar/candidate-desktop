import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotShortlistedComponent } from './not-shortlisted.component';

describe('NotShortlistedComponent', () => {
  let component: NotShortlistedComponent;
  let fixture: ComponentFixture<NotShortlistedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotShortlistedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotShortlistedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
