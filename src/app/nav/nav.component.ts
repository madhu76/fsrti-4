import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Subscription } from 'rxjs';
import { CredentialResponse } from 'google-one-tap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  private subscription: Subscription;
  user: any;

  // Email login form properties
  showEmailForm = false;
  emailForm: FormGroup;
  confirmationLinkForm: FormGroup;
  showconfirmationLinkInput = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  userEmail = '';

  constructor(public authService: AuthService, private zone: NgZone, private fb: FormBuilder) {
    // Initialize forms
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.confirmationLinkForm = this.fb.group({
      confirmationLink: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.subscription = this.authService.user.subscribe(user => {
      this.zone.run(() => {
        this.user = user;
      });
    });

    // Handle authentication from URL hash (for magic links)
    this.handleAuthFromUrl();

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

  private handleAuthFromUrl(): void {
    // Check if there's a hash in the URL (Supabase magic link)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      // Clear the hash from the URL for better UX
      window.history.replaceState(null, '', window.location.pathname);
    }
  }

  handleCredentialResponse(response: CredentialResponse) {
    this.zone.run(() => {
      this.authService.handleCredentialResponse(response);
    });
  }

  loginWithEmail() {
    this.showEmailForm = !this.showEmailForm;
    this.resetEmailForm();
  }

  async sendconfirmationLink() {
    if (this.emailForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.userEmail = this.emailForm.get('email')?.value;

      const result = await this.authService.sendconfirmationLink(this.userEmail);

      this.loading = false;

      if (result.error) {

        if (result.error.message) {
          this.errorMessage = result.error.message;
        }
        else {
          this.errorMessage = 'Failed to send confirmationLink. Please try again.';

        }
      } else {
        this.showconfirmationLinkInput = true;
        this.successMessage = 'Link sent to your email. Please check your inbox.';
      }
    }
  }

  async verifyconfirmationLink() {
    if (this.confirmationLinkForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const confirmationLink = this.confirmationLinkForm.get('confirmationLink')?.value;

      const result = await this.authService.verifyconfirmationLink(this.userEmail, confirmationLink);

      this.loading = false;

      if (result.error) {
        this.errorMessage = 'Invalid confirmationLink. Please try again.';
      } else {
        this.successMessage = 'Login successful!';
        // Close form after successful login
        setTimeout(() => {
          this.hideEmailForm();
        }, 1000);
      }
    }
  }

  resetEmailForm() {
    this.showconfirmationLinkInput = false;
    this.emailForm.reset();
    this.confirmationLinkForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.userEmail = '';
  }

  hideEmailForm() {
    this.showEmailForm = false;
    this.resetEmailForm();
  }

  backToEmail() {
    this.showconfirmationLinkInput = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.confirmationLinkForm.reset();
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
