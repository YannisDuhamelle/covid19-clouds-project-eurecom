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

// The AddNewsComponent is the component that is handling the data and the form from the add-news page
export class AddNewsComponent implements OnInit {

  apiCovid19CountriesUrl = "https://api.covid19api.com/summary";
  countries: { [index: string]: any; } | any;
  newsFromForm: any;
  countryFromForm: any;
  globalNews: any;

  // This constructor is calling the API to get the list of all the countries (stored in this.countries)
  constructor(private http: HttpClient, private firestore: AngularFirestore, public signinService: SigninServiceService) {
    this.getDataFromAPIWorldCountries().subscribe((doc) => {
      const countries_raw: { [index: string]: any } | any = doc;
      this.countries = countries_raw.Countries;
    });
  }

  // At the creation of the page, we are pulling all the world news stored in the firestore database
  ngOnInit(): void {
    this.firestore.collection("news").doc("news_per_country").collection("world").valueChanges().subscribe((news: DocumentData[]) => { this.globalNews = news });
  }

  // This function is calling the API to return the world summary data (that is containing the list of all countries)
  getDataFromAPIWorldCountries() {
    return this.http.get(this.apiCovid19CountriesUrl);
  }

  // This function is adding a news to the firestore database
  addNews() {
    if (this.countryFromForm != undefined && this.newsFromForm != undefined) {
      let newNews: News = {
        date: new Date(),
        news: this.newsFromForm,
        country: this.countryFromForm,
        author: this.signinService.getUser()
      };

      // If the country specified is not "world" (so any country), we are adding that news to the country collection
      if (newNews.country != "world"){
        this.firestore.collection("news").doc("news_per_country").collection(newNews.country).add(newNews);
      }
      // We are adding that news to the world collection anyway
      this.firestore.collection("news").doc("news_per_country").collection("world").add(newNews);

      //This is for making the form empty to let us fill it again
      this.newsFromForm = undefined;
      this.countryFromForm = undefined;
    }
  }

}
