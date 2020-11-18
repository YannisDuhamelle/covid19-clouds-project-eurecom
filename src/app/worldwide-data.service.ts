import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorldwideDataService {

  private apiCovid19SummaryUrl = 'https://api.covid19api.com/summary';

  constructor(private http: HttpClient) { }

  /** GET data from the API */
  getDataFromAPIWorldSummary(){
    return this.http.get(this.apiCovid19SummaryUrl);
  }
  getDataFromAPIWorldPerDay(day: Date, dayPlusOne: Date) {
    let valueOfDay: number = day.getDate();
    let valueOfDayPlusOne: number = dayPlusOne.getDate();
    let apiCovid19WorldPerDayUrl = 'https://api.covid19api.com/world';
    console.log("Voici le mois du jour : " + day.getMonth());
    apiCovid19WorldPerDayUrl += "?from=" + day.getFullYear() + "-" + (day.getMonth()+1) + "-";
    if (valueOfDay < 10) {
      apiCovid19WorldPerDayUrl += "0" + day.getDate();
    }
    else {
      apiCovid19WorldPerDayUrl += day.getDate();
    }
    apiCovid19WorldPerDayUrl += "T00:00:00Z&to=" + dayPlusOne.getFullYear() + "-" + (dayPlusOne.getMonth()+1) + "-";
    if (valueOfDayPlusOne < 10) {
      apiCovid19WorldPerDayUrl += "0" + dayPlusOne.getDate() + "T00:00:00Z";
    }
    else {
      apiCovid19WorldPerDayUrl += dayPlusOne.getDate() + "T00:00:00Z";
    }
    console.log(apiCovid19WorldPerDayUrl);
    return this.http.get(apiCovid19WorldPerDayUrl);
  }
  getDataFromAPIPerDay13April() {
    let today = new Date();
    let valueOfToday: number = today.getDate();

    let apiCovid19WorldPerDayUrl = 'https://api.covid19api.com/world';

    console.log("Voici le mois du jour : " + today.getMonth());
    apiCovid19WorldPerDayUrl += "?from=2020-04-13T00:00:00Z&to=" + today.getFullYear() + "-" + (today.getMonth() + 1) + "-";
    if (valueOfToday < 10) {
      apiCovid19WorldPerDayUrl += "0" + today.getDate() + "T00:00:00Z";
    }
    else {
      apiCovid19WorldPerDayUrl += today.getDate() + "T00:00:00Z";
    }
    console.log(apiCovid19WorldPerDayUrl);
    return this.http.get(apiCovid19WorldPerDayUrl);
  }
}
