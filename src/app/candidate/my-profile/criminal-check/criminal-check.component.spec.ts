import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriminalCheckComponent } from './criminal-check.component';

describe('CriminalCheckComponent', () => {
  let component: CriminalCheckComponent;
  let fixture: ComponentFixture<CriminalCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriminalCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriminalCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
