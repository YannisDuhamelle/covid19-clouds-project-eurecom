import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {

  apiCovid19CountriesUrl = "https://api.covid19api.com/summary";
  countries: { [index: string]: any; } | undefined;

  constructor(private http: HttpClient) {
    this.getDataFromAPIWorldCountries().subscribe((doc) => {
      console.log(doc);
      const countries_raw: { [index: string]: any } = doc;
      this.countries = countries_raw.Countries;
    });
  }

  ngOnInit(): void {
  }

  getDataFromAPIWorldCountries() {
    return this.http.get(this.apiCovid19CountriesUrl);
  }

}
