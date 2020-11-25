import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CountryDataService } from '../country-data.service';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  name: String | undefined;
  dataFromAPI: any;
  slug: String | undefined;

  public pieChartOptions: ChartOptions = { responsive: true, legend: { position: 'top' } };
  public pieChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

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
  }

  generatePieCharts() {
    let activeCases = this.dataFromAPI["TotalConfirmed"] - (this.dataFromAPI["TotalRecovered"] + this.dataFromAPI["TotalDeaths"])
    this.pieChartData = [this.dataFromAPI["TotalDeaths"], this.dataFromAPI["TotalRecovered"], activeCases];
  }

}
