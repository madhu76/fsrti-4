import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-registration-complete',
  templateUrl: './registration-complete.component.html',
  styleUrls: ['./registration-complete.component.css']
})
export class RegistrationCompleteComponent implements OnInit {

  constructor(private _flashMessagesService: FlashMessagesService) { }

  ngOnInit(): void {
  }

}
