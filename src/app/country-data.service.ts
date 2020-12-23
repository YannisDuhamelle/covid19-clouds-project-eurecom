import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryDataService {

  private apiCovid19SummaryUrl = 'https://api.covid19api.com/summary';
  private country = "";

  constructor(private http: HttpClient) { }

  getDataFromAPIWorldSummary() {
    return this.http.get(this.apiCovid19SummaryUrl);
  }

  getDataFromAPIWorldPerDay(day: Date, dayPlusOne: Date, country: string) {
    this.country = country;
    let valueOfDay: number = day.getDate();
    let valueOfDayPlusOne: number = dayPlusOne.getDate();
    let apiCovid19WorldPerDayUrl = 'https://api.covid19api.com/total/country/'+this.country;
    console.log("Voici le mois du jour : " + day.getMonth());
    apiCovid19WorldPerDayUrl += "?from=" + day.getFullYear() + "-" + (day.getMonth() + 1) + "-";
    if (valueOfDay < 10) {
      apiCovid19WorldPerDayUrl += "0" + day.getDate();
    }
    else {
      apiCovid19WorldPerDayUrl += day.getDate();
    }
    apiCovid19WorldPerDayUrl += "T00:00:00Z&to=" + dayPlusOne.getFullYear() + "-" + (dayPlusOne.getMonth() + 1) + "-";
    if (valueOfDayPlusOne < 10) {
      apiCovid19WorldPerDayUrl += "0" + dayPlusOne.getDate() + "T00:00:00Z";
    }
    else {
      apiCovid19WorldPerDayUrl += dayPlusOne.getDate() + "T00:00:00Z";
    }
    console.log(apiCovid19WorldPerDayUrl);
    return this.http.get(apiCovid19WorldPerDayUrl);
  }

  getDataFromAPIDayOne(country: string) {
    let apiCovid19CountryDayOne = 'https://api.covid19api.com/total/dayone/country/'+country;
    console.log(apiCovid19CountryDayOne);
    return this.http.get(apiCovid19CountryDayOne);
  }
}
