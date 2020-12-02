import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Position} from '../position/interfaces/position';
@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  gitHubUrlPath = '/positions.json';
  constructor(private http: HttpClient) {}

  // gets all positions from gihub api
  public getPositions(description: string, page: number): Observable<Position[]> {
    let params = new HttpParams({});
    if (description !== '' ||  page !== 0) {
      params = new HttpParams({fromString: 'description=' + description + ' &page=' + page});
    }
    return this.http
      .get<Position[]>(this.gitHubUrlPath, {responseType: 'json', params})
      .pipe(catchError(this.handleError([])));
  }

  public getPositionById(id: string): Observable<Position>{
    return this.http
    .get<Position>('/positions/' + id + '.json', {responseType: 'json'})
    .pipe(catchError(this.handleError(null)));
  }

  // tslint:disable-next-line: typedef
  private handleError<T>(result?: T){
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}

