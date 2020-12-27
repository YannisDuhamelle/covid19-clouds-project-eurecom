import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { News } from '../news.model';
import { SigninServiceService } from '../signin-service.service';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {

  apiCovid19CountriesUrl = "https://api.covid19api.com/summary";
  countries: { [index: string]: any; } | undefined;
  newsFromForm: any;
  countryFromForm: any;
  globalNews: any;

  constructor(private http: HttpClient, private firestore: AngularFirestore, public signinService: SigninServiceService) {
    this.getDataFromAPIWorldCountries().subscribe((doc) => {
      const countries_raw: { [index: string]: any } | any = doc;
      this.countries = countries_raw.Countries;
    });
  }

  ngOnInit(): void {
    this.firestore.collection("news").doc("news_per_country").collection("world").valueChanges().subscribe((news: DocumentData[]) => { this.globalNews = news });
  }

  getDataFromAPIWorldCountries() {
    return this.http.get(this.apiCovid19CountriesUrl);
  }

  addNews() {
    if (this.countryFromForm != undefined && this.newsFromForm != undefined) {
      let newNews: News = {
        date: new Date(),
        news: this.newsFromForm,
        country: this.countryFromForm,
        author: this.signinService.getUser()
      };
      if (newNews.country != "world"){
        this.firestore.collection("news").doc("news_per_country").collection(newNews.country).add(newNews);
      }
      this.firestore.collection("news").doc("news_per_country").collection("world").add(newNews);

      //This is for making the form empty to let us fill it again
      this.newsFromForm = undefined;
      this.countryFromForm = undefined;
    }
  }

}
