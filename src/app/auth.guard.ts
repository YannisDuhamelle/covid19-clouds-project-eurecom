import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SigninServiceService } from './signin-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private signinService: SigninServiceService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.signinService.userSignedIn()) {
      this.router.navigate(["signin"]);
    }
    else {
      if (!this.signinService.getUser()["admin"]) {
        this.router.navigate(["signin"]);
      }
    }
    return true;
  }

}
