import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { CountryDataService } from '../country-data.service';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})

// The CountryComponent is the component that is handling the data from any country page
export class CountryComponent implements OnInit {

  name: String | undefined;
  dataFromAPI: any;
  slug: string | undefined;
  dataDayOne: any;

  public pieChartOptions: ChartOptions = { responsive: true, legend: { position: 'top' } };
  public pieChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  public countryNews: any;

  constructor(private router: Router, private dataService: CountryDataService, private firestore: AngularFirestore) { }

  // This function is called at the creation of the page
  async ngOnInit(): Promise<void> {

    // First, we are extracting the slug (the name of the country) from the URL to know which country are we handling
    let url = this.router.url;
    this.slug = url.split('/')[2];

    // Then, we are looking in the firestore database if there are already some data for this country
    this.firestore.collection("country_data").doc(this.slug).get().subscribe(async (doc) => {

      let today = new Date();

      // If there is already some data in the firestore database, we are comparing the date of those data with the date of today
      if (doc.exists) {

        let day_of_today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let day_of_lastUpdate = new Date(doc.get("lastUpdate")["year"], doc.get("lastUpdate")["month"], doc.get("lastUpdate")["day"]);

        // If the date of the data in the firestore DB is the same than today, we are pulling those data
        // Then, we are using it for the table and the charts
        if (day_of_today.toISOString() == day_of_lastUpdate.toISOString()) {
          this.dataFromAPI = doc.get("dataSummary");
          this.generatePieCharts();
          this.name = this.dataFromAPI.Country;
          let data = doc.get("dataDayOne");
          this.generateBarCharts(data);
          this.generateLineCharts(data);
        }
        // If the date of the data in the firestore DB isn't the same than today,
        // we are pulling data from the API, push them to replace the one in firestore, and then use them for the table and the charts
        else {
          this.dataService.getDataFromAPIWorldSummary().subscribe(data => {
            if ("Countries" in data) {
              let countries: any = data["Countries"];
              for (let i = 0; i < countries.length; i++) {
                if (countries[i].Slug == this.slug) {
                  this.dataFromAPI = countries[i];
                }
              }
            }
            this.name = this.dataFromAPI.Country;
            this.generatePieCharts();
            this.firestore.collection("country_data").doc(this.slug).set({
              dataSummary: this.dataFromAPI,
              lastUpdate: { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }
            }, { merge: true });
          });
          (await this.dataService.getDataFromAPIDayOne(this.slug)).subscribe(dataReceive => {
            const data: { [index: string]: any } | any = dataReceive;
            this.generateBarCharts(data);
            this.generateLineCharts(data);
            this.firestore.collection("country_data").doc(this.slug).set({
              dataDayOne: data,
              lastUpdate: { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }
            }, { merge: true });
          });
        }
      }

      // If there is not data of the country in the firestore database yet,
      // we are pulling data from the API, push them to save it in firestore, and then use them for the table and the charts
      else {
        this.dataService.getDataFromAPIWorldSummary().subscribe(data => {
          if ("Countries" in data) {
            let countries: any = data["Countries"];
            for (let i = 0; i < countries.length; i++) {
              if (countries[i].Slug == this.slug) {
                this.dataFromAPI = countries[i];
              }
            }
          }
          this.name = this.dataFromAPI.Country;
          this.generatePieCharts();
          this.firestore.collection("country_data").doc(this.slug).set({
            dataSummary: this.dataFromAPI,
            lastUpdate: { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }
          }, { merge: true });
        });
        (await this.dataService.getDataFromAPIDayOne(this.slug)).subscribe(dataReceive => {
          const data: { [index: string]: any } | any = dataReceive;
          this.generateBarCharts(data);
          this.generateLineCharts(data);
          this.firestore.collection("country_data").doc(this.slug).set({
            dataDayOne: data,
            lastUpdate: { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }
          }, { merge: true });
        });
      }
    });

    // At the end, we are getting the news about this country
    this.getCountryNews();
  }

  // This function is used to set the parameters of the pie chart
  generatePieCharts() {
    let activeCases = this.dataFromAPI["TotalConfirmed"] - (this.dataFromAPI["TotalRecovered"] + this.dataFromAPI["TotalDeaths"])
    this.pieChartData = [this.dataFromAPI["TotalDeaths"], this.dataFromAPI["TotalRecovered"], activeCases];
  }

  // This function is used to set the parameters of the bar chart
  // We received as argument the data from the call "dayone" that is giving us all data per day since the first day of the epidemy in the country
  generateBarCharts(data: string | any[]) {

    let dailyDeath: number[] = [];
    let dailyRecovered: number[] = [];
    let dailyNewCase: number[] = [];
    let dailyDate: string[] = [];

    // We use the 8 last days to get the data, and we are pushing them in a special list that will be used to display the bar chart
    for (let i = data.length - 7; i < data.length; i++) {
      dailyDeath.push(data[i]["Deaths"] - data[i - 1]["Deaths"]);
      dailyRecovered.push(data[i]["Recovered"] - data[i - 1]["Recovered"]);
      dailyNewCase.push(data[i]["Confirmed"] - data[i - 1]["Confirmed"]);
      dailyDate.push(data[i]["Date"])
    }
    this.barChartData = [
      { data: dailyDeath, label: 'Daily Deaths' },
      { data: dailyRecovered, label: 'Daily Recovered' },
      { data: dailyNewCase, label: 'Daily New Cases' }
    ];
    // We need to compute the x-axis (the date of the corresponding data)
    for (let i = 0; i < dailyDate.length; i++) {
      let day = new Date(dailyDate[i]);
      this.barChartLabels.push(day.toDateString())
    }
  }

  // This function is used to set the parameters of the line chart
  // We received as argument the data from the call "dayone" that is giving us all data per day since the first day of the epidemy in the country
  generateLineCharts(data: string | any[]) {

    let dailyDeath = [];
    let dailyRecovered = [];
    let dailyNewCase = [];
    let dailyDate: string[] = [];

    // We use all the days to get the data, and we are pushing them in a special list that will be used to display the line chart
    for (let i = 0; i < data.length; i++) {
      dailyDeath.push(data[i]["Deaths"]);
      dailyRecovered.push(data[i]["Recovered"]);
      dailyNewCase.push(data[i]["Confirmed"]);
      dailyDate.push(data[i]["Date"])
    }
    this.lineChartData = [
      { data: dailyDeath, label: 'Total Deaths' },
      { data: dailyRecovered, label: 'Total Recovered' },
      { data: dailyNewCase, label: 'Total Cases' }
    ];
    // We need to compute the x-axis (the date of the corresponding data)
    for (let i = 0; i < dailyDate.length; i++) {
      let day = new Date(dailyDate[i]);
      this.lineChartLabels.push(day.toDateString())
    }
  }

  // This function is used to pull the news about the country
  getCountryNews() {
    this.firestore.collection("news").doc("news_per_country").collection(this.slug!).valueChanges().subscribe((news: DocumentData[]) => {
      this.countryNews = news
    });
  }
}
