import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  name: String | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
    let url = this.router.url;
    let brut_name = url.split('/')[2];
    while (brut_name.search("%20") != -1) {
      brut_name = brut_name.replace("%20", " ");
    }
    this.name = brut_name;
  }

}
