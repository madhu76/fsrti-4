import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-forgotpasswordemail',
  templateUrl: './forgotpasswordemail.component.html',
  styleUrls: ['./forgotpasswordemail.component.css']
})
export class ForgotpasswordemailComponent implements OnInit {

  constructor(private _flashMessagesService: FlashMessagesService) { }

  ngOnInit(): void {
  }

}
