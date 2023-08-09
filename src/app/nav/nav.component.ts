import { Component, NgZone, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import { Subscription } from 'rxjs';
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
