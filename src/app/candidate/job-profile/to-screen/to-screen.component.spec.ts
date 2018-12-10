import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToScreenComponent } from './to-screen.component';

describe('ToScreenComponent', () => {
  let component: ToScreenComponent;
  let fixture: ComponentFixture<ToScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
