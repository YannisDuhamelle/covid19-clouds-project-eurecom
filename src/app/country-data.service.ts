import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

// This is the service that is handling the API calls for any country page 
export class CountryDataService {

  private apiCovid19SummaryUrl = 'https://api.covid19api.com/summary';

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  // This function is calling the API summary (for the summary table and the pie chart)
  getDataFromAPIWorldSummary() {
    return this.http.get(this.apiCovid19SummaryUrl);
  }

  // This function is calling the API dayone (for the bar chart and the line chart)
  async getDataFromAPIDayOne(country: string | undefined) {
    let apiCovid19CountryDayOne = 'https://api.covid19api.com/total/dayone/country/'+country;
    return this.http.get(apiCovid19CountryDayOne);
  }
}
