import { TestBed, inject } from '@angular/core/testing';

import { AlertPopService } from './alert-pop.service';

describe('AlertPopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertPopService]
    });
  });

  it('should be created', inject([AlertPopService], (service: AlertPopService) => {
    expect(service).toBeTruthy();
  }));
});
