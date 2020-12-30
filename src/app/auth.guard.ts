import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SigninServiceService } from './signin-service.service';

@Injectable({
  providedIn: 'root'
})

// This is the guard that is authorizing users to reach the add-news page
export class AuthGuard implements CanActivate {

  constructor(private signinService: SigninServiceService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // If the user is not signed in, redirect him to the signin page
    if (!this.signinService.userSignedIn()) {
      this.router.navigate(["signin"]);
    }
    // If the user is signedin, look if he is an admin or not
    else {
      // If the user is not an admin, redirect him to the signin page (that is explaining him why he cannot acces this page)
      if (!this.signinService.getUser()["admin"]) {
        this.router.navigate(["signin"]);
      }
    }
    return true;
  }

}
