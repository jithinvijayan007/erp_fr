
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad,
   Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ServerService } from './server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  version;
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  constructor(private router: Router, private servServ: ServerService) {}
  // }
  canActivate(
    next: ActivatedRouteSnapshot,state: RouterStateSnapshot)
    // : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree | void
     {
      // console.log('here');
      // return true;
  
    if (!localStorage.getItem('version')) {
      localStorage.setItem('version', '100');
    }
    
    this.version = localStorage.getItem('version')
    
    return this.servServ.postData('user/url_web_version/',{}).pipe(map(res => {
        
        if (environment.production && (Number(this.version) !== Number(res['int_version']))) {          
          swal.fire({
            title: "We're not ageist, but your old version is holding us back.",
            text: "Update to the latest version to see this site in all its glory.",
            type: 'warning',
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            // cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              localStorage.setItem('version', res['int_version'])
              window.location.reload();

            }
          });
        }
        return true

    }));


  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
