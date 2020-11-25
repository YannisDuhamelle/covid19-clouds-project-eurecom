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
      //this.generatePieCharts();
    });
    
  }

}
