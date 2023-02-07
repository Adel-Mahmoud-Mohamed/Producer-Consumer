import { TestBed, inject } from '@angular/core/testing';
import { appService } from './app.service';

describe('Service: app', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [appService]
    });
  });

  it('should ...', inject([appService], (service: appService) => {
    expect(service).toBeTruthy();
  }));
});