import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntarySelfDeclarationPopComponent } from './voluntary-self-declaration-pop.component';

describe('VoluntarySelfDeclarationPopComponent', () => {
  let component: VoluntarySelfDeclarationPopComponent;
  let fixture: ComponentFixture<VoluntarySelfDeclarationPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoluntarySelfDeclarationPopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoluntarySelfDeclarationPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
