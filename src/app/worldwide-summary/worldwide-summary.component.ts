import { Component, OnInit } from '@angular/core';
import { WorldwideDataService } from '../worldwide-data.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-worldwide-summary',
  templateUrl: './worldwide-summary.component.html',
  styleUrls: ['./worldwide-summary.component.css']
})
export class WorldwideSummaryComponent implements OnInit {

  dataFromAPI: any;

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

  constructor(private dataService: WorldwideDataService) { }

  ngOnInit() {
    this.dataService.getDataFromAPI().subscribe(data => {
      this.dataFromAPI = data;
      this.generateCharts();
    });
  }

  generateCharts() {
    let activeCases = this.dataFromAPI.Global["TotalConfirmed"] - (this.dataFromAPI.Global["TotalRecovered"] + this.dataFromAPI.Global["TotalDeaths"])
    this.pieChartData = [this.dataFromAPI.Global["TotalDeaths"], this.dataFromAPI.Global["TotalRecovered"], activeCases];
  }

}
