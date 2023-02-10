import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

 
  constructor(public authService:AuthService) { }

  ngOnInit(): void {
  }

  /*getUsername()
  {
     this.username=this.authService.getUserName;
     console.log(`user in nav`+this.username);
  }*/
}
