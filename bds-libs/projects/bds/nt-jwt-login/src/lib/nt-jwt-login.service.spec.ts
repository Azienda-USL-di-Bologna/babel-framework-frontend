import { TestBed, inject } from '@angular/core/testing';

import { NtJwtLoginService } from './nt-jwt-login.service';

describe('NtJwtLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NtJwtLoginService]
    });
  });

  it('should be created', inject([NtJwtLoginService], (service: NtJwtLoginService) => {
    expect(service).toBeTruthy();
  }));
});
