import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseCheckComponent } from './database-check.component';

describe('DatabaseCheckComponent', () => {
  let component: DatabaseCheckComponent;
  let fixture: ComponentFixture<DatabaseCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
