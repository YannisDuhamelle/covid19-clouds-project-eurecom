import { TestBed } from '@angular/core/testing';

import { WorldwideDataService } from './worldwide-data.service';

describe('WorldwideDataService', () => {
  let service: WorldwideDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorldwideDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
