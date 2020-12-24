import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CountryDataService {

  private apiCovid19SummaryUrl = 'https://api.covid19api.com/summary';
  private country = "";

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  getDataFromAPIWorldSummary() {
    return this.http.get(this.apiCovid19SummaryUrl);
  }

  getDataFromAPIDayOne(country: string) {
    //console.log("Firestrore data_country : "+this.firestore.collection("data_country").doc(country));
    let apiCovid19CountryDayOne = 'https://api.covid19api.com/total/dayone/country/'+country;
    console.log(apiCovid19CountryDayOne);
    return this.http.get(apiCovid19CountryDayOne);
  }
}
