import { Component, NgZone, OnInit } from '@angular/core';
import {AuthService} from '../Services/auth.service';
import { Subscription } from 'rxjs';
import { CredentialResponse } from 'google-one-tap';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  private subscription: Subscription;
  user: any;

  constructor(public authService:AuthService, private zone: NgZone) { }

  ngOnInit() {
    this.subscription = this.authService.user.subscribe(user => {
      this.zone.run(() => {
        this.user = user;
      });
    });

    // Initialize Google Sign-In
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      console.log('Google\'s One-tap sign in script loaded!');

      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '1065141553028-db2mo9v7a9g9q2a9skqu3jsnf068ovm8.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: false        
      });

      //@ts-ignore
      google.accounts.id.renderButton(
          document.getElementById("googleLoginId"),
          {}
        );
    };
  }

  handleCredentialResponse(response: CredentialResponse) {
    this.zone.run(() => {
      this.authService.handleCredentialResponse(response);
    }); 
  }

  loginWithEmail() {
    // Placeholder for email login functionality
    console.log('Email login clicked - functionality to be implemented');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  /*getUsername()
  {
     this.username=this.authService.getUserName;
     console.log(`user in nav`+this.username);
  }*/
}
