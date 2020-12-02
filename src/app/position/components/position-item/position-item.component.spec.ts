import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GithubApiService } from 'src/app/service/github-api.service';
import { PositionItemComponent } from './position-item.component';
import { positionData } from '../../../service/mock.positions';
import {  defer, of } from 'rxjs';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';

// tslint:disable-next-line: typedef
export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

// tslint:disable-next-line: typedef
export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}
describe('PositionItemComponent', () => {
  let component: PositionItemComponent;
  let fixture: ComponentFixture<PositionItemComponent>;
  let getPositionSpy;
  let positionEl;
  const id = 'f9ad776b-9022-4fe9-a84e-50a527ec2a6e';
  beforeEach(async () => {
 // Create a fake  GithubApiService spy
    const githubApiService = jasmine.createSpyObj('GithubApiService', ['getPositionById']);
    getPositionSpy = githubApiService.getPositionById.and.returnValue(asyncData(Object.assign({}, positionData[0])));

    await TestBed.configureTestingModule({
      declarations: [ PositionItemComponent  , SanitizeHtmlPipe],
      imports: [ MatDialogModule ],
      providers: [ { provide: GithubApiService, useValue: githubApiService } ,
       {provide: MAT_DIALOG_DATA , useValue: {}} ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionItemComponent);
    component = fixture.componentInstance;
    positionEl = fixture.nativeElement;
  });

  /* Test the observable  subscription value coming correctly and rendering correctly or not */
  it('Make API call and render data Correctly', waitForAsync(() => {
     expect(component.position).toBeUndefined('Position item should be Undefined at First ');
     let h2positionEl = positionEl.querySelector('h2');
     expect(h2positionEl).toBeNull('Title should be null on load as its inside ngIf');
     expect(component.dataId).toBeUndefined('Data Id should be undefined');
     component.dataId = id;
     fixture.detectChanges(); // ngOnInit() which calls the service.getPositionById funciton in which we return positions[0] item
     expect(getPositionSpy.calls.any()).toBe(true, 'getPositionSpy called');
     fixture.whenStable().then(() => {  // wait for async getPositionById
       fixture.detectChanges();         // update view with position
       h2positionEl = positionEl.querySelector('h2');
       expect(component.position).toEqual(positionData[0], 'Position item should have data after we fetch from server ');
       expect(h2positionEl.textContent).toContain('Administrator für' , 'Should have the title retrieved from API now');
      });
  }));

  it('Should test No Data to display scenario', waitForAsync(() => {
    expect(component.position).toBeUndefined('Position item should be Undefined at First ');
    component.dataId = id;
    getPositionSpy.and.returnValue(asyncData(null)); // Return null mocking Error
    fixture.detectChanges(); // ngOnInit() which calls the service.getPositionById funciton in which we return positions[0] item
    expect(getPositionSpy.calls.any()).toBe(true, 'getPositionSpy called');
    fixture.whenStable().then(() => {  // wait for async getPositionById
      fixture.detectChanges();         // update view with position
      expect(component.position).toBeNull('Position item is null ');
      const noDataDiv = positionEl.querySelector('.no-data');
      expect(noDataDiv.textContent).toContain('No Records' , 'Should have the No Records to display message');
      });
    }));
});
