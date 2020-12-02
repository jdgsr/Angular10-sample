

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Position } from '../position/interfaces/position';

import { positionData } from './mock.positions';
// Other imports
import { TestBed } from '@angular/core/testing';

import { GithubApiService } from './github-api.service';

describe('GithubApiService', () => {
  let httpMock: HttpTestingController;
  let githubApiService: GithubApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
      // Provide the service-under-test and its dependencies
      providers: [GithubApiService],
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpMock = TestBed.inject(HttpTestingController);
    githubApiService = TestBed.inject(GithubApiService);
    // TestBed.inject(AuthInterceptor);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMock.verify();
  });


  describe('#getPositions', () => {
    let expectedPositions: Position[];
    let url;
    const description = '';
    const page = 0;
    beforeEach(() => {
      expectedPositions = positionData as Position[];
      url = githubApiService.gitHubUrlPath;
    });

    it('should return expected Positions (called once)', () => {
      githubApiService
        .getPositions(description, page)
        .subscribe(
          (positions) =>
            expect(positions).toEqual(
              expectedPositions,
              'should return expected Position'
            ),
          fail
        );
      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock positions
      req.flush(expectedPositions);
    });

    it('should be OK returning no positions', () => {
      githubApiService
      .getPositions(description, page)
        .subscribe(
          (positions) =>
            expect(positions.length).toEqual(
              0,
              'should have empty positions array'
            ),
          fail
        );

      const req = httpMock.expectOne(url);
      req.flush([]); // Respond with no positions
    });

    afterAll(() => {
      TestBed.resetTestingModule();
    });
  });



  describe('#getPositionsById', () => {
    let expectedPosition: Position;
    let url;
    let id;
    let notFoundUrl;
    beforeEach(() => {
      expectedPosition = positionData[0];
      id = 'f9ad776b-9022-4fe9-a84e-50a527ec2a6e';
      url = '/positions/' + id + '.json';
      notFoundUrl = '/positions/dummy.json';
    });

    it('should return expected position (called once)', () => {
      githubApiService
        .getPositionById(id)
        .subscribe(
          (position) =>
            expect(position).toEqual(
              expectedPosition,
              'should return expected position'
            ),
          fail
        );
      /* Below will act as server - mock */

      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual('GET');

      // Responding with 0 th element. Mocking that 0 th element is the item user asked for .
      req.flush(positionData[0]);
    });

    it('should return 404', () => {
      githubApiService
        .getPositionById('dummy')
        .subscribe(
          (position) =>
            expect(position).toEqual(
              null, // Our error Handler throws the null object on error status codes
              'should return null object as we receive 404 '
            ),
          fail
        );
      /* Below will act as server - mock */

      const req = httpMock.expectOne(notFoundUrl);
      expect(req.request.method).toEqual('GET');
      const msg = 'deliberate 404 error';
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    afterAll(() => {
      TestBed.resetTestingModule();
    });
  });
});
