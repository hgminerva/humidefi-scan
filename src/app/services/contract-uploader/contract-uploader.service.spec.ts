import { TestBed } from '@angular/core/testing';

import { ContractUploaderService } from './contract-uploader.service';

describe('ContractUploaderService', () => {
  let service: ContractUploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
