import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryDataService {

  private apiCovid19SummaryUrl = 'https://api.covid19api.com/summary';

  constructor(private http: HttpClient) { }

  getDataFromAPIWorldSummary() {
    return this.http.get(this.apiCovid19SummaryUrl);
  }
}
