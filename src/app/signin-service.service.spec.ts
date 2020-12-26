import { TestBed } from '@angular/core/testing';

import { SigninServiceService } from './signin-service.service';

describe('SigninServiceService', () => {
  let service: SigninServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SigninServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
