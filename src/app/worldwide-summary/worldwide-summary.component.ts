import { Component, OnInit } from '@angular/core';
import { WorldwideDataService } from '../worldwide-data.service';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-worldwide-summary',
  templateUrl: './worldwide-summary.component.html',
  styleUrls: ['./worldwide-summary.component.css']
})
export class WorldwideSummaryComponent implements OnInit {

  dataFromAPI: any;
  dataFromAPIWorldPerDay: any;

  public pieChartOptions: ChartOptions = {responsive: true,legend: {position: 'top'}};
  public pieChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];

  constructor(private dataService: WorldwideDataService) { }

  ngOnInit() {
    this.dataService.getDataFromAPIWorldSummary().subscribe(data => {
      this.dataFromAPI = data;
      this.generatePieCharts();
    });
    
    let today = new Date();
    let dayMinus7 = new Date(today);
    dayMinus7.setDate(dayMinus7.getDate() - 7);
    this.dataService.getDataFromAPIWorldPerDay(dayMinus7, today).subscribe(dataReceive => {
      const data: { [index: string]: any } = dataReceive;
      console.log(data);
      console.log(data[0]);
      console.log(data[0]["NewDeaths"]);
      let dailyDeath: number[] = [];
      let dailyRecovered: number[] = [];
      let dailyNewCase: number[] = [];
      for (let i = data.length - 1; i >= 0; i--) {
        dailyDeath.push(data[i]["NewDeaths"]);
        dailyRecovered.push(data[i]["NewRecovered"]);
        dailyNewCase.push(data[i]["NewConfirmed"]);
        console.log("Yannis");
        //console.log(dailyDeath);
      }
      console.log("Fait!")
      console.log(dailyDeath);
      this.generateBarCharts(dailyDeath,dailyRecovered,dailyNewCase);
    });
  }

  generatePieCharts() {
    let activeCases = this.dataFromAPI.Global["TotalConfirmed"] - (this.dataFromAPI.Global["TotalRecovered"] + this.dataFromAPI.Global["TotalDeaths"])
    this.pieChartData = [this.dataFromAPI.Global["TotalDeaths"], this.dataFromAPI.Global["TotalRecovered"], activeCases];
  }
  generateBarCharts(dailyDeath: number[], dailyRecovered: any[], dailyNewCase: any[]) {
    console.log("Cretion of the chart");
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
    console.log(this.barChartData);
  }
}
