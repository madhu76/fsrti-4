import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {RegistrationDataService} from '../registration-data.service';
import {DataService} from '../data.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  fname='';
  lname='';
  email='';
  registrationForm: FormGroup;
  submitted = false;
  passwordPattern = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})';
  mobilePattern='^((\\+91-?)|0)?[0-9]{10}$';
  
  countries
  
  constructor(private formBuilder: FormBuilder,private router: Router,
    private data :RegistrationDataService, private dataS:DataService) { }

  ngOnInit(): void {
    this.data.dfname.subscribe(x =>this.fname=x);
    this.data.dlname.subscribe(x =>this.lname=x);
    this.data.demail.subscribe(x =>this.email=x);
    this.registrationForm = this.formBuilder.group({
      password:['',[Validators.required,Validators.pattern(this.passwordPattern)]],
      conformPassword:['',[Validators.required]],
      title:['',[Validators.required]],
      middleName:[''],
      degree:[''],
      preferredName:[''],
      primaryPhone:['',[Validators.required,Validators.pattern(this.mobilePattern)]],
      orcid:[''],
      position:[''],
      institution:['',[Validators.required]],
      department:[''],
      address:[''],
      city:[''],
      postalCode:[''],
      country:['',[Validators.required]]
    }
   )

    this.dataS.getCountries().subscribe(d => {
      this.countries=d;
    })

  };
  get f(){
    return this.registrationForm.controls;
  }




  onSubmit(){
    
    if(this.registrationForm.valid)
    {
      //console.log(this.registrationForm.value);
      this.data.formData(this.email,this.registrationForm.value.password,this.registrationForm.value.title,
        this.registrationForm.value.degree,this.registrationForm.value.middlename,this.registrationForm.value.preferredname,
        this.registrationForm.value.orcid,this.registrationForm.value.institution,this.registrationForm.value.phone,
        this.registrationForm.value.position,this.registrationForm.value.address,this.registrationForm.value.department,
        this.registrationForm.value.city,this.registrationForm.value.postalcode,this.registrationForm.value.country)
      this.router.navigate(['signup/confirm']);
    }
    this.submitted = true;
  }

}
