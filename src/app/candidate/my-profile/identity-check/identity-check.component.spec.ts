import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityCheckComponent } from './identity-check.component';

describe('IdentityCheckComponent', () => {
  let component: IdentityCheckComponent;
  let fixture: ComponentFixture<IdentityCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentityCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
