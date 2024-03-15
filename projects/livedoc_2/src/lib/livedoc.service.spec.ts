import { TestBed } from '@angular/core/testing';

import { LivedocService } from './livedoc.service';

describe('LivedocService', () => {
  let service: LivedocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivedocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
