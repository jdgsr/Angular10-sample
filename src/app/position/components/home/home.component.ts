import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { GithubApiService } from 'src/app/service/github-api.service';
import {PositionItemComponent} from '../position-item/position-item.component';
import {Position} from '../../interfaces/position';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [GithubApiService]
})
export class HomeComponent implements AfterViewInit, OnInit {


  displayedColumns: string[] = ['title', 'company', 'type', 'location', 'created_at'];
  /* TODO: description , how to apply ,, use urls for redirection */
  dataSource: MatTableDataSource<Position>;
  positions: Position[] = [];
  pageSize = 50;
  description = '';
  apiDataObservable: Observable<Position[]>;
  resultsLength = 0;
  isLoadingResults = true;
  previousPageIndex = 0;
  lastIndexReached = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private dialog: MatDialog, private githubApiService: GithubApiService) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit(): void {

  }
 /* After view Init , we will call the API with empty strng and page = 0
 Below will be fired on page change enent of paginator */
  ngAfterViewInit(): void {
    this.isLoadingResults = true;
    this.paginator.page
      .pipe(
        startWith([]),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.githubApiService.getPositions(this.description, this.paginator.pageIndex);
        }),
        map(data => {
          this.isLoadingResults = false;
          // Flip flag to show that loading has finished.
          if (!this.lastIndexReached && this.paginator.pageIndex >= this.previousPageIndex) {

            if (this.resultsLength === 0 && data.length >= this.pageSize) {
              this.resultsLength = this.pageSize + 1;
            } else if (data.length >= this.pageSize) {
              this.resultsLength += data.length;
            } else {
              this.resultsLength += data.length;
              this.lastIndexReached = true;
            }
          }
          this.previousPageIndex = this.paginator.pageIndex;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource = new MatTableDataSource(data));
  }


  applyFilterOld(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.description = filterValue.trim().toLowerCase();
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.isLoadingResults = true;
    this.apiDataObservable = this.githubApiService.getPositions(this.description, this.paginator.pageIndex)
    this.apiDataObservable.subscribe(data =>  {
      this.dataSource = new MatTableDataSource(data);
      this.isLoadingResults = false;
    });
  }

  /* API call with search input data . we will send with query paramters description = search item and page = 0 */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.description = filterValue.trim().toLowerCase();
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.resultsLength = 0;
    }
    const source = observableOf([]);
    source.pipe(
      startWith([]),
      switchMap(() => {  // Switch to new Observable , cancel the old and emit the new values.
        this.isLoadingResults = true;
        return this.githubApiService.getPositions(this.description, this.paginator.pageIndex);
      }),  map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.resultsLength = data.length;
        return data;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        return observableOf([]);
      })
    ).subscribe(data => this.dataSource = new MatTableDataSource(data));
  }

  /* Open the dialog box and load the ID.json in PositionItemComponent */
  openDialog(event, dataId): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(PositionItemComponent, {
      data: {
       id: dataId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
