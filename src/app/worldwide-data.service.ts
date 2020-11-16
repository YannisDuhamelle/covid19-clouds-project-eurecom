import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorldwideDataService {

  private apiCovid19SummaryUrl = 'https://api.covid19api.com/summary';

  constructor(private http: HttpClient) { }

  /** GET data from the API */
  getDataFromAPI(){
    return this.http.get(this.apiCovid19SummaryUrl);
  }
}
