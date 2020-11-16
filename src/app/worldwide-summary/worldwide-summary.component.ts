import { Component, OnInit } from '@angular/core';
import { WorldwideDataService } from '../worldwide-data.service';

@Component({
  selector: 'app-worldwide-summary',
  templateUrl: './worldwide-summary.component.html',
  styleUrls: ['./worldwide-summary.component.css']
})
export class WorldwideSummaryComponent implements OnInit {

  dataFromAPI: any;

  constructor(private dataService: WorldwideDataService) { }

  ngOnInit(): void {
    this.dataService.getDataFromAPI().subscribe(data => { this.dataFromAPI = data });
  }

}
