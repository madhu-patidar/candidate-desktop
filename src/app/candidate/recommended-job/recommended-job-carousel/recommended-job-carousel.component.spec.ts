import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedJobCarouselComponent } from './recommended-job-carousel.component';

describe('RecommendedJobCarouselComponent', () => {
  let component: RecommendedJobCarouselComponent;
  let fixture: ComponentFixture<RecommendedJobCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedJobCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedJobCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
