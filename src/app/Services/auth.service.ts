import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { CredentialResponse } from 'google-one-tap';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<any>({});
  public user:  Observable<any> = this.userSubject.asObservable();
  public  accessToken: any = null;
  public isAuthenticated: boolean = false;
  private  decodedToken: any = null;
  
 constructor(){}
  handleCredentialResponse(response: CredentialResponse) {
    this.accessToken = response?.credential;
    try {
      this.decodedToken = JSON.parse(atob(this.accessToken.split('.')[1]));
    } catch (e) {
      alert("Error Logging In, please try again");
    }
    this.userSubject.next(
    {
      name: this.decodedToken.given_name,
      email: this.decodedToken.email
    });
    this.isAuthenticated = true;
  }
  logout(): void {
    //@ts-ignore
    google.accounts.id.disableAutoSelect()
    this.accessToken = null;
    this.decodedToken = null;
    this.userSubject.next({});
    this.isAuthenticated = false;
  }
}

