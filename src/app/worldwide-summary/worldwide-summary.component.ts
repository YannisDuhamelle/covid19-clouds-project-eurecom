import { Component, OnInit } from '@angular/core';
import { WorldwideDataService } from '../worldwide-data.service';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-worldwide-summary',
  templateUrl: './worldwide-summary.component.html',
  styleUrls: ['./worldwide-summary.component.css']
})
export class WorldwideSummaryComponent implements OnInit {

  dataFromAPI: any;
  dataFromAPIWorldPerDay: any;
  dataCountryFromAPI: any;

  public pieChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  public globalNews: any;

  public selected = 0;

  constructor(private dataService: WorldwideDataService, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.firestore.collection("world_summary").doc("Global").get().subscribe((doc) => {
      console.log("je suis dans le subscribe de world_summary firestore");
      let today = new Date();
      if (doc.exists) {
        console.log("Doc exist");
        let day_of_today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let day_of_lastUpdate = new Date(doc.get("lastUpdate")["year"], doc.get("lastUpdate")["month"], doc.get("lastUpdate")["day"]);
        if (day_of_today.toISOString() == day_of_lastUpdate.toISOString()) {
          console.log("Already fetched today");
          this.dataFromAPI = doc.get("data");
          this.generatePieCharts();
        }
        else {
          console.log("Not fetched today");
          this.dataService.getDataFromAPIWorldSummary().subscribe(data => {
            this.dataFromAPI = data;
            this.dataFromAPI = this.dataFromAPI.Global;
            this.generatePieCharts();
            this.firestore.collection("world_summary").doc("Global").set({
              data: this.dataFromAPI,
              lastUpdate: { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }
            }, { merge: true });
          });
        }
      }
      else {
        console.log("Doc does not exist");
        this.dataService.getDataFromAPIWorldSummary().subscribe(data => {
          this.dataFromAPI = data;
          this.dataFromAPI = this.dataFromAPI.Global;
          this.generatePieCharts();
          this.firestore.collection("world_summary").doc("Global").set({
            data: this.dataFromAPI,
            lastUpdate: { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }
          }, { merge: true });
        });
      }
      console.log(this.dataFromAPI);
    });

    let today = new Date();
    let dayMinus7 = new Date(today);
    dayMinus7.setDate(dayMinus7.getDate() - 7);
    this.dataService.getDataFromAPIWorldPerDay(dayMinus7, today).subscribe(dataReceive => {
      const data: { [index: string]: any } = dataReceive;
      let dailyDeath: number[] = [];
      let dailyRecovered: number[] = [];
      let dailyNewCase: number[] = [];
      for (let i = 0; i < data.length; i++) {
        dailyDeath.push(data[i]["NewDeaths"]);
        dailyRecovered.push(data[i]["NewRecovered"]);
        dailyNewCase.push(data[i]["NewConfirmed"]);
      }
      this.generateBarCharts(dailyDeath, dailyRecovered, dailyNewCase);
    });

    this.dataService.getDataFromAPIPerDay13April().subscribe(dataReceive => {
      const data: { [index: string]: any } = dataReceive;
      let dailyDeath: number[] = [];
      let dailyRecovered: number[] = [];
      let dailyNewCase: number[] = [];
      for (let i = data.length - 1; i >= 0; i--) {
        dailyDeath.push(data[i]["TotalDeaths"]);
        dailyRecovered.push(data[i]["TotalRecovered"]);
        dailyNewCase.push(data[i]["TotalConfirmed"]);
      }
      this.generateLineCharts(dailyDeath, dailyRecovered, dailyNewCase);
    });
    this.dataService.getDataFromAPIWorldSummary().subscribe(data => {
      this.dataCountryFromAPI = data;
      this.dataCountryFromAPI = this.dataCountryFromAPI.Countries;
    });

    this.getGlobalNews();
  }

  generatePieCharts() {

    let activeCases = this.dataFromAPI["TotalConfirmed"] - (this.dataFromAPI["TotalRecovered"] + this.dataFromAPI["TotalDeaths"])
    this.pieChartData = [this.dataFromAPI["TotalDeaths"], this.dataFromAPI["TotalRecovered"], activeCases];
  }
  generateBarCharts(dailyDeath: number[], dailyRecovered: any[], dailyNewCase: any[]) {
    this.barChartData = [
      { data: dailyDeath, label: 'Daily Deaths' },
      { data: dailyRecovered, label: 'Daily Recovered' },
      { data: dailyNewCase, label: 'Daily New Cases' }
    ];
    let today = new Date();
    let day = new Date(today);
    for (let i = dailyDeath.length-1; i >= 0; i--) {
      let day = new Date(today);
      day.setDate(day.getDate() - i);
      this.barChartLabels.push(day.toDateString())
    }
  }
  generateLineCharts(dailyDeath: number[], dailyRecovered: any[], dailyNewCase: any[]) {
    let dailyRecoveredSort = dailyRecovered.sort((a, b) => a - b);
    let dailyNewCaseSort = dailyNewCase.sort((a, b) => a - b);
    let dailyDeathSort = dailyDeath.sort((a, b) => a-b);
    this.lineChartData = [
      { data: dailyDeathSort, label: 'Total Deaths' },
      { data: dailyRecoveredSort, label: 'Total Recovered' },
      { data: dailyNewCaseSort, label: 'Total Cases' }
    ];
    let today = new Date();
    for (let i = dailyDeath.length - 1; i >= 0; i--) {
      let day = new Date(today);
      day.setDate(day.getDate() - i);
      this.lineChartLabels.push(day.toDateString())
    }
  }

  getGlobalNews() {
    this.firestore.collection("news").doc("news_per_country").collection("world").valueChanges().subscribe((news: DocumentData[]) => {
      this.globalNews = news
    });
  }

  sortCountries(selectedSort: number) {
    this.selected = selectedSort;
    if (selectedSort == 1) {
      this.dataCountryFromAPI.sort((a: { Country: string; }, b: { Country: string; }) => {
        let fa = a.Country.toLowerCase(),
          fb = b.Country.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    }
    else if (selectedSort == 2) {
      this.dataCountryFromAPI.sort((a: { Country: string; }, b: { Country: string; }) => {
        let fa = a.Country.toLowerCase(),
          fb = b.Country.toLowerCase();

        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      });
    }
    else if (selectedSort == 3) {
      this.dataCountryFromAPI.sort((a: { NewConfirmed: number; }, b: { NewConfirmed: number; }) => {
        return b.NewConfirmed - a.NewConfirmed;
      });
    }
    else if (selectedSort == 4) {
      this.dataCountryFromAPI.sort((a: { NewConfirmed: number; }, b: { NewConfirmed: number; }) => {
        return a.NewConfirmed - b.NewConfirmed;
      });
    }
    else if (selectedSort == 5) {
      this.dataCountryFromAPI.sort((a: { TotalConfirmed: number; }, b: { TotalConfirmed: number; }) => {
        return b.TotalConfirmed - a.TotalConfirmed;
      });
    }
    else if (selectedSort == 6) {
      this.dataCountryFromAPI.sort((a: { TotalConfirmed: number; }, b: { TotalConfirmed: number; }) => {
        return a.TotalConfirmed - b.TotalConfirmed;
      });
    }
    else if (selectedSort == 7) {
      this.dataCountryFromAPI.sort((a: { NewRecovered: number; }, b: { NewRecovered: number; }) => {
        return b.NewRecovered - a.NewRecovered;
      });
    }
    else if (selectedSort == 8) {
      this.dataCountryFromAPI.sort((a: { NewRecovered: number; }, b: { NewRecovered: number; }) => {
        return a.NewRecovered - b.NewRecovered;
      });
    }
    else if (selectedSort == 9) {
      this.dataCountryFromAPI.sort((a: { TotalRecovered: number; }, b: { TotalRecovered: number; }) => {
        return b.TotalRecovered - a.TotalRecovered;
      });
    }
    else if (selectedSort == 10) {
      this.dataCountryFromAPI.sort((a: { TotalRecovered: number; }, b: { TotalRecovered: number; }) => {
        return a.TotalRecovered - b.TotalRecovered;
      });
    }
    else if (selectedSort == 11) {
      this.dataCountryFromAPI.sort((a: { NewDeaths: number; }, b: { NewDeaths: number; }) => {
        return b.NewDeaths - a.NewDeaths;
      });
    }
    else if (selectedSort == 12) {
      this.dataCountryFromAPI.sort((a: { NewDeaths: number; }, b: { NewDeaths: number; }) => {
        return a.NewDeaths - b.NewDeaths;
      });
    }
    else if (selectedSort == 13) {
      this.dataCountryFromAPI.sort((a: { TotalDeaths: number; }, b: { TotalDeaths: number; }) => {
        return b.TotalDeaths - a.TotalDeaths;
      });
    }
    else if (selectedSort == 14) {
      this.dataCountryFromAPI.sort((a: { TotalDeaths: number; }, b: { TotalDeaths: number; }) => {
        return a.TotalDeaths - b.TotalDeaths;
      });
    }
  }
}
