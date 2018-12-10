import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoItYourselfComponent } from './do-it-yourself.component';

describe('DoItYourselfComponent', () => {
  let component: DoItYourselfComponent;
  let fixture: ComponentFixture<DoItYourselfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoItYourselfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoItYourselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
