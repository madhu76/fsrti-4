import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../Services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-author-menu',
  templateUrl: './author-menu.component.html',
  styleUrls: ['./author-menu.component.css']
})
export class AuthorMenuComponent implements OnInit {

  constructor(public auth:AuthService,public router:Router) { }

  ngOnInit(): void {
    if(!this.auth.isAuthenticated)
    {
      this.router.navigate(['/login'])
    }
  }

}
