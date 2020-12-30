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

// The WorldwideSummaryComponent is the component that is handling the data from the world/welcoming page
export class WorldwideSummaryComponent implements OnInit {

  dataFromAPI: any;
  dataFromAPIWorldPerDay: any;
  dataCountryFromAPI: any;

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

  public globalNews: any;

  public selected = 0;

  constructor(private dataService: WorldwideDataService, private firestore: AngularFirestore) { }

  // This function is called at the creation of the page
  ngOnInit() {

    // First, we are looking in the firestore database if there are already some data for the world summary table (and pie charts)
    this.firestore.collection("world_summary").doc("Global").get().subscribe((doc) => {

      let today = new Date();

      // If there is already some data in the firestore database, we are comparing the date of those data with the date of today
      if (doc.exists) {

        let day_of_today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let day_of_lastUpdate = new Date(doc.get("lastUpdate")["year"], doc.get("lastUpdate")["month"], doc.get("lastUpdate")["day"]);

        // If the date of the data in the firestore DB is the same than today, we are pulling those data
        // Then, we are using it for the table and the pie chart
        if (day_of_today.toISOString() == day_of_lastUpdate.toISOString()) {
          this.dataFromAPI = doc.get("data");
          this.generatePieCharts();
        }
        // If the date of the data in the firestore DB isn't the same than today,
        // we are pulling data from the API, push them to replace the one in firestore, and then use them for the table and the pie chart
        else {
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

      // If there is not data of the country in the firestore database yet,
      // we are pulling data from the API, push them to save it in firestore, and then use them for the table and the pie chart
      else {
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
    });

    // Then, we are computing the bar charts from the API calls "world?[7_days_ago]to[today]
    let today = new Date();
    let dayMinus7 = new Date(today);
    dayMinus7.setDate(dayMinus7.getDate() - 7);
    this.dataService.getDataFromAPIWorldPerDay(dayMinus7, today).subscribe(dataReceive => {
      const data: { [index: string]: any } | any = dataReceive;
      this.generateBarCharts(data);
    });

    // We are computing the line charts from the API calls "world?[13_April]to[today]
    this.dataService.getDataFromAPIPerDay13April().subscribe(dataReceive => {
      const data: { [index: string]: any } | any = dataReceive;
      this.generateLineCharts(data);
    });

    // We are computing the news to display on the world page
    this.getGlobalNews();

    // Finally, we are computing the country list from the API call "summary"
    this.dataService.getDataFromAPIWorldSummary().subscribe(data => {
      this.dataCountryFromAPI = data;
      this.dataCountryFromAPI = this.dataCountryFromAPI.Countries;
    });
  }

  // This function is used to set the parameters of the pie chart
  generatePieCharts() {
    let activeCases = this.dataFromAPI["TotalConfirmed"] - (this.dataFromAPI["TotalRecovered"] + this.dataFromAPI["TotalDeaths"])
    this.pieChartData = [this.dataFromAPI["TotalDeaths"], this.dataFromAPI["TotalRecovered"], activeCases];
  }

  // This function is used to set the parameters of the bar chart
  // We received as argument the data from the API call "world" that is giving us all data per day for the last 7 days
  generateBarCharts(data: string | any[]) {

    let dailyDeath: number[] = [];
    let dailyRecovered: number[] = [];
    let dailyNewCase: number[] = [];

     // We are pushing the data categories in a special list that will be used to display the bar chart
    for (let i = 0; i < data.length; i++) {
      dailyDeath.push(data[i]["NewDeaths"]);
      dailyRecovered.push(data[i]["NewRecovered"]);
      dailyNewCase.push(data[i]["NewConfirmed"]);
    }
    this.barChartData = [
      { data: dailyDeath, label: 'Daily Deaths' },
      { data: dailyRecovered, label: 'Daily Recovered' },
      { data: dailyNewCase, label: 'Daily New Cases' }
    ];
    // We need to compute the x-axis (the date of the corresponding data)
    let today = new Date();
    for (let i = dailyDeath.length-1; i >= 0; i--) {
      let day = new Date(today);
      day.setDate(day.getDate() - i);
      this.barChartLabels.push(day.toDateString())
    }
  }

  // This function is used to set the parameters of the line chart
  // We received as argument the data from the API call "world" that is giving us all data per day since the 14 april
  generateLineCharts(data: string | any[]) {

    let dailyDeath: number[] = [];
    let dailyRecovered: number[] = [];
    let dailyNewCase: number[] = [];

    // We are pushing the data categories in a special list that will be used to display the line chart
    for (let i = data.length - 1; i >= 0; i--) {
      dailyDeath.push(data[i]["TotalDeaths"]);
      dailyRecovered.push(data[i]["TotalRecovered"]);
      dailyNewCase.push(data[i]["TotalConfirmed"]);
    }
    let dailyRecoveredSort = dailyRecovered.sort((a, b) => a - b);
    let dailyNewCaseSort = dailyNewCase.sort((a, b) => a - b);
    let dailyDeathSort = dailyDeath.sort((a, b) => a-b);
    this.lineChartData = [
      { data: dailyDeathSort, label: 'Total Deaths' },
      { data: dailyRecoveredSort, label: 'Total Recovered' },
      { data: dailyNewCaseSort, label: 'Total Cases' }
    ];
    // We need to compute the x-axis (the date of the corresponding data)
    let today = new Date();
    for (let i = dailyDeath.length - 1; i >= 0; i--) {
      let day = new Date(today);
      day.setDate(day.getDate() - i);
      this.lineChartLabels.push(day.toDateString())
    }
  }

  // This function is used to pull the world news
  getGlobalNews() {
    this.firestore.collection("news").doc("news_per_country").collection("world").valueChanges().subscribe((news: DocumentData[]) => {
      this.globalNews = news
    });
  }

  // This function is used to sort the country list depending on differennt criteria
  sortCountries(selectedSort: number) {

    // We are modifying the place of the displayedsorted colomn (on the html page)
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
