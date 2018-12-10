import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialAssistanceDeclarationComponent } from './special-assistance-declaration.component';

describe('SpecialAssistanceDeclarationComponent', () => {
  let component: SpecialAssistanceDeclarationComponent;
  let fixture: ComponentFixture<SpecialAssistanceDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialAssistanceDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialAssistanceDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
