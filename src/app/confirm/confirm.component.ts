import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationDataService } from '../registration-data.service';
import { AuthService } from '../auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  registerData: any = {}
  confirmForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private data: RegistrationDataService, private auth: AuthService, private _flashMessagesService: FlashMessagesService) { }

  ngOnInit(): void {
    this.data.dfname.subscribe(x => this.registerData.firstname = x);
    this.data.dlname.subscribe(x => this.registerData.lastname = x);
    this.data.demail.subscribe(x => this.registerData.email = x);
    this.data.dusername.subscribe(x => this.registerData.username = x);
    this.data.dpassword.subscribe(x => this.registerData.password = x);
    this.data.ddegree.subscribe(x => this.registerData.degree = x);
    this.data.dtitle.subscribe(x => this.registerData.title = x);
    this.data.dmiddlename.subscribe(x => this.registerData.middlename = x);
    this.data.dpreferredname.subscribe(x => this.registerData.preferredname = x);
    this.data.dorcid.subscribe(x => this.registerData.orcid = x);
    this.data.dinstitution.subscribe(x => this.registerData.institution = x);
    this.data.dposition.subscribe(x => this.registerData.position = x);
    this.data.dphone.subscribe(x => this.registerData.phone = x);
    this.data.daddress.subscribe(x => this.registerData.address = x);
    this.data.ddepartment.subscribe(x => this.registerData.department = x);
    this.data.dcity.subscribe(x => this.registerData.city = x);
    this.data.dcountry.subscribe(x => this.registerData.country = x);
    this.data.dpostalcode.subscribe(x => this.registerData.postalcode = x);
    this.confirmForm = this.formBuilder.group({
      
      country: ['country--'],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }
  get f() {
    return this.confirmForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.confirmForm.valid) {
      console.log(this.confirmForm.value);
      this.auth.sendRegistrationData(this.registerData);

      //navigate...
    }
    
  }

}
