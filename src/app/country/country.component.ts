import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router, private dataService: CountryDataService) { }

  ngOnInit(): void {
    let url = this.router.url;
    this.slug = url.split('/')[2];
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
    });
    let today = new Date();
    let dayMinus8 = new Date(today);
    dayMinus8.setDate(dayMinus8.getDate() - 8);
    this.dataService.getDataFromAPIWorldPerDay(dayMinus8, today, this.slug).subscribe(dataReceive => {
      const data: { [index: string]: any } = dataReceive;
      let dailyDeath: number[] = [];
      let dailyRecovered: number[] = [];
      let dailyNewCase: number[] = [];
      for (let i = 1; i < data.length; i++) {
        dailyDeath.push(data[i]["Deaths"] - data[i-1]["Deaths"]);
        dailyRecovered.push(data[i]["Recovered"] - data[i - 1]["Recovered"]);
        dailyNewCase.push(data[i]["Confirmed"] - data[i - 1]["Confirmed"]);
      }
      this.generateBarCharts(dailyDeath, dailyRecovered, dailyNewCase);
    });
    this.dataService.getDataFromAPIDayOne(this.slug).subscribe(dataReceive => {
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

  generateBarCharts(dailyDeath: number[], dailyRecovered: any[], dailyNewCase: any[]) {
    this.barChartData = [
      { data: dailyDeath, label: 'Daily Deaths' },
      { data: dailyRecovered, label: 'Daily Recovered' },
      { data: dailyNewCase, label: 'Daily New Cases' }
    ];
    let today = new Date();
    let day = new Date(today);
    for (let i = dailyDeath.length; i >= 1; i--) {
      let day = new Date(today);
      day.setDate(day.getDate() - i);
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
