This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.1.

## Development server

Run `npm install` on the project folder to install necessary packages.  

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build 

Run `ng build` to build the angular project. it will generate the build files to dist/ folder 

## Dependencies 
 
 * Angular Material 

## Assumptions 
  
* Git Hub Job API is not returning the total_count of records to calculate the number of pages to display. Api returns 50 records at max per page. 
   So what has been done for pagination? 
    1. set pageSize = 50 records , make API call with pageIndex = 0 and display the first page results to User. If results  length >= pageSize(50) then add the results count to resultsLength variable with +1( +1 Added to assume there will be more records so that pagination renders next page). if length < 50 then we assume its the first / last page.
    2. On click of next page . Catch the event and make API call . Fetch the results. check if results length >= pageSize(50) . if it's more than 50, then we assume there might be more records. Therefore, we will sum them to recordsLength. If it's less than 50, then we will assume that it is the end of results and mark lastPageReached to true (This flag helps to not sum the results again when we execute the previous page event).
    3. By above logic we will be able to mimic the pagination but one catch here is that there is 1 extra record assumption to render previous/next page buttons. 
    4. Same works for search results too. 

* http://localhost:4200 has been blocked by CORS policy:
    GitHub Api blocks the http://localhost:4200 url as a part of Cross origin resource sharing. I enabled a plugin in chrome to use the localhost server to hit the GitHub Url.
	Chrome Plug-in: Allow CORS: Access-Control-Allow-Origin

* Asynchronous search on every key press in the search bar. 
   GitHub Api is fired on every key up event of search input field instead user click again on another search button or icon. We use Observables to handle this and cancel previous event and catch the current event to fetch the result. switchMap() is the saviour. 
