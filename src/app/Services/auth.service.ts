import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { CredentialResponse } from 'google-one-tap';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

declare const google: any;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<any>({});
  public user:  Observable<any> = this.userSubject.asObservable();
  public  accessToken: any = null;
  public isAuthenticated: boolean = false;
  private  decodedToken: any = null;
  private supabase: SupabaseClient;
  private supabaseUser: any = null;
  
 constructor(){
   this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
   
   // Listen for auth state changes
   this.supabase.auth.onAuthStateChange((event, session) => {
     if (event === 'SIGNED_IN' && session) {
       this.handleSupabaseSession(session);
     } else if (event === 'SIGNED_OUT') {
       this.logout();
     }
   });

   // Check for existing session on initialization
   this.checkExistingSession();
 }

 private async checkExistingSession(): Promise<void> {
   try {
     const session = this.supabase.auth.session();
     if (session) {
       this.handleSupabaseSession(session);
     }
   } catch (error) {
     console.error('Error checking existing session:', error);
   }
 }
  
  // Handle Supabase session and extract user info
  private handleSupabaseSession(session: any): void {
    this.accessToken = session.access_token;
    this.supabaseUser = session.user;
    
    // Update user subject with Supabase user data
    this.userSubject.next({
      name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
      email: session.user.email
    });
    this.isAuthenticated = true;
  }
  
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
    // Handle Google logout
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
    
    // Handle Supabase logout
    if (this.supabaseUser) {
      this.supabase.auth.signOut();
    }
    
    // Clear all tokens and state
    this.accessToken = null;
    this.decodedToken = null;
    this.supabaseUser = null;
    this.userSubject.next({});
    this.isAuthenticated = false;
  }

  // Utility methods to get user info regardless of login method
  getCurrentUser(): any {
    return this.userSubject.value;
  }

  getUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user?.email || null;
  }

  getUserName(): string | null {
    const user = this.getCurrentUser();
    return user?.name || null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Email confirmationLink methods
  async sendconfirmationLink(email: string): Promise<{ error?: any; success?: boolean }> {
    try {
      const { error } = await this.supabase.auth.signIn({
        email: email,
      });

      if (error) {
        console.error('Error sending confirmationLink:', error);
        return { error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending confirmationLink:', error);
      return { error };
    }
  }

  async verifyconfirmationLink(email: string, token: string): Promise<{ error?: any; success?: boolean }> {
    try {
      const { session, error } = await this.supabase.auth.verifyOTP({
        email: email,
        token: token,
        type: 'magiclink'
      });

      if (error) {
        console.error('Error verifying confirmationLink:', error);
        return { error };
      }

      // The session will be automatically handled by the auth state change listener
      return { success: true };
    } catch (error) {
      console.error('Error verifying confirmationLink:', error);
      return { error };
    }
  }

  async logoutSupabase(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
      this.logout(); // Call existing logout method
    } catch (error) {
      console.error('Error logging out from Supabase:', error);
      this.logout(); // Still call logout to clear local state
    }
  }
}

