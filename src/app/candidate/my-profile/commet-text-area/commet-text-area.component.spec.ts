import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommetTextAreaComponent } from './commet-text-area.component';

describe('CommetTextAreaComponent', () => {
  let component: CommetTextAreaComponent;
  let fixture: ComponentFixture<CommetTextAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommetTextAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommetTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
