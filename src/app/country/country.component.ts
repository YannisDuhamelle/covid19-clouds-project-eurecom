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

  constructor(private router: Router, private dataService: CountryDataService) { }

  ngOnInit(): void {
    let url = this.router.url;
    let brut_name = url.split('/')[2];
    while (brut_name.search("%20") != -1) {
      brut_name = brut_name.replace("%20", " ");
    }
    this.name = brut_name;
    this.dataService.getDataFromAPIWorldSummary().subscribe(data => {
      if ("Countries" in data) {
        let countries: any = data["Countries"];
        for (let i = 0; i < countries.length; i++) {
          if (countries[i].Country == this.name) {
            this.dataFromAPI = countries[i];
          }
        }
      }
      //this.generatePieCharts();
    });
  }

}
