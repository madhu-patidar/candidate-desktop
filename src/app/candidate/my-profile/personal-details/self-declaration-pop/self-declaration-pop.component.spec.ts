import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfDeclarationPopComponent } from './self-declaration-pop.component';

describe('SelfDeclarationPopComponent', () => {
  let component: SelfDeclarationPopComponent;
  let fixture: ComponentFixture<SelfDeclarationPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfDeclarationPopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfDeclarationPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
