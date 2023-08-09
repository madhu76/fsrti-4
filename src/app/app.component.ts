import { Component } from '@angular/core';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EPS';
  constructor(private authService:AuthService){}
  ngOnInit() {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      console.log('Google\'s One-tap sign in script loaded!');

      // @ts-ignore
      google.accounts.id.initialize({
        // Ref: https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
        client_id: '214685469754-rjtln9aho6rpbs22gkg4fjqsvjck4cvp.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this), // Whatever function you want to trigger...
        auto_select: true,
        cancel_on_tap_outside: false        
      });
      
      // @ts-ignore
      google.accounts.id.renderButton(document.getElementById("googleLoginButton"), {
        theme: 'outline',
        size: 'large',
        type: 'icon',
        shape: 'circle'
      });

      // @ts-ignore
      google.accounts.id.prompt();
  
    };
  }

  handleCredentialResponse(response: CredentialResponse) {
    this.authService.handleCredentialResponse(response);
  }
}
