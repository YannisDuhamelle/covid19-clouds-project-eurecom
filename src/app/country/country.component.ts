import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { CountryDataService } from '../country-data.service';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  name: String | undefined;
  dataFromAPI: any;
  slug: string | undefined;

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

  constructor(private router: Router, private dataService: CountryDataService, private firestore: AngularFirestore) { }

  async ngOnInit(): Promise<void> {
    let url = this.router.url;
    this.slug = url.split('/')[2];
    this.firestore.collection("country_data").doc(this.slug).get().subscribe((doc) => {
      console.log("je suis dans le subscribe de country_data firestore "+this.slug);
      let today = new Date();
      if (doc.exists) {
        console.log("Doc exist");
        let day_of_today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let day_of_lastUpdate = new Date(doc.get("lastUpdate")["year"], doc.get("lastUpdate")["month"], doc.get("lastUpdate")["day"]);
        if (day_of_today.toISOString() == day_of_lastUpdate.toISOString()) {
          console.log("Already fetched today");
          this.dataFromAPI = doc.get("dataSummary");
          this.generatePieCharts();
          this.name = this.dataFromAPI.Country;
        }
        else {
          console.log("Not fetched today");
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
        }
      }
      else {
        console.log("Doc does not exist");
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
      }
      console.log(this.dataFromAPI);
    });
    
    let today = new Date();
    (await this.dataService.getDataFromAPIDayOne(this.slug)).subscribe(dataReceive => {
      const data: { [index: string]: any } = dataReceive;
      let dailyDeath: number[] = [];
      let dailyRecovered: number[] = [];
      let dailyNewCase: number[] = [];
      let dailyDate: string[] = [];
      for (let i = data.length-7; i < data.length; i++) {
        dailyDeath.push(data[i]["Deaths"] - data[i-1]["Deaths"]);
        dailyRecovered.push(data[i]["Recovered"] - data[i - 1]["Recovered"]);
        dailyNewCase.push(data[i]["Confirmed"] - data[i - 1]["Confirmed"]);
        dailyDate.push(data[i]["Date"])
      }
      this.generateBarCharts(dailyDeath, dailyRecovered, dailyNewCase, dailyDate);
    });
    (await this.dataService.getDataFromAPIDayOne(this.slug)).subscribe(dataReceive => {
      const data: { [index: string]: any } = dataReceive;
      let dailyDeath: number[] = [];
      let dailyRecovered: number[] = [];
      let dailyNewCase: number[] = [];
      for (let i = 0; i < data.length; i++) {
        dailyDeath.push(data[i]["Deaths"]);
        dailyRecovered.push(data[i]["Recovered"]);
        dailyNewCase.push(data[i]["Confirmed"]);
      }
      this.generateLineCharts(dailyDeath, dailyRecovered, dailyNewCase);
    });
  }

  generatePieCharts() {
    let activeCases = this.dataFromAPI["TotalConfirmed"] - (this.dataFromAPI["TotalRecovered"] + this.dataFromAPI["TotalDeaths"])
    this.pieChartData = [this.dataFromAPI["TotalDeaths"], this.dataFromAPI["TotalRecovered"], activeCases];
  }

  generateBarCharts(dailyDeath: number[], dailyRecovered: any[], dailyNewCase: any[], dailyDate: string[]) {
    this.barChartData = [
      { data: dailyDeath, label: 'Daily Deaths' },
      { data: dailyRecovered, label: 'Daily Recovered' },
      { data: dailyNewCase, label: 'Daily New Cases' }
    ];
    let today = new Date();
    let day = new Date(today);
    for (let i = 0; i < dailyDate.length; i++) {
      let day = new Date(dailyDate[i]);
      this.barChartLabels.push(day.toDateString())
    }
    console.log(this.barChartData);
  }

  generateLineCharts(dailyDeath: number[], dailyRecovered: any[], dailyNewCase: any[]) {
    this.lineChartData = [
      { data: dailyDeath, label: 'Total Deaths' },
      { data: dailyRecovered, label: 'Total Recovered' },
      { data: dailyNewCase, label: 'Total Cases' }
    ];
    let today = new Date();
    for (let i = dailyDeath.length - 1; i >= 0; i--) {
      let day = new Date(today);
      day.setDate(day.getDate() - i);
      this.lineChartLabels.push(day.toDateString())
    }
  }

}
