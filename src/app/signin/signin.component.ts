import { Component, OnInit } from '@angular/core';
import { SigninServiceService } from '../signin-service.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

// The SigninComponent is the component that is handling the displaying of the signin page
// There are almost nothing here, to handle signin function please go to the signin-service.service.ts file
export class SigninComponent implements OnInit {

  constructor(public signinService: SigninServiceService) { }

  ngOnInit(): void {
  }

}
