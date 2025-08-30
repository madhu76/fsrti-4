import { Component, NgZone } from '@angular/core';
import { AuthService } from './Services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EPS';
  constructor(private authService:AuthService, private ngZone: NgZone){}
  ngOnInit() {
    // Google Sign-In initialization moved to nav component
  }
}
