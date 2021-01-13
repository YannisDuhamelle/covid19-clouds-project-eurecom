import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// This is the service that is handling the API calls for the world page 
export class WorldwideDataService {

  private apiCovid19SummaryUrl = 'https://api.covid19api.com/summary';

  constructor(private http: HttpClient) { }

  // This function is calling the API summary (for the summary table, the pie chart and the country list)
  getDataFromAPIWorldSummary(){
    return this.http.get(this.apiCovid19SummaryUrl);
  }

  // This function is calling the API world?from=[7_days_ago]&to=[today] (for the bar chart)
  getDataFromAPIWorldPerDay(day: Date, dayPlusOne: Date) {
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 1);
    dayPlusOne = new Date(dayPlusOne.getFullYear(), dayPlusOne.getMonth(), dayPlusOne.getDate(), 1);

    let apiCovid19WorldPerDayUrl = 'https://api.covid19api.com/world';
    apiCovid19WorldPerDayUrl += "?from=" + day.toISOString() + "&to=" + dayPlusOne.toISOString();
    console.log(apiCovid19WorldPerDayUrl);
    return this.http.get(apiCovid19WorldPerDayUrl);
  }

  // This function is calling the API world?from=[13_April]&to=[today] (for the line chart)
  getDataFromAPIPerDay13April() {
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 1);

    let apiCovid19WorldPerDayUrl = 'https://api.covid19api.com/world';
    apiCovid19WorldPerDayUrl += "?from=2020-04-13T00:00:00Z&to=" + today.toISOString();
    console.log(apiCovid19WorldPerDayUrl);
    return this.http.get(apiCovid19WorldPerDayUrl);
  }
}
