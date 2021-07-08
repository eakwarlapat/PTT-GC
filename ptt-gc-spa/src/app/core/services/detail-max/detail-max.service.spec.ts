import { TestBed } from '@angular/core/testing';

import { DetailMaxService } from './detail-max.service';

describe('DetailMaxService', () => {
  let service: DetailMaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailMaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
