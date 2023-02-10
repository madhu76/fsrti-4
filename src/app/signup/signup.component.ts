import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {RegistrationDataService} from '../registration-data.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  name='';
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(private formBuilder: FormBuilder,private router: Router,private data :RegistrationDataService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstname:['',[Validators.required]],
      lastname:['',[Validators.required]],
      email:['',[Validators.required,Validators.pattern(this.emailPattern)]]
    });
  }
  get f(){return this.registerForm.controls;}
  onSubmit(){
    if(this.registerForm.valid)
    {
      console.log(this.registerForm.value);
      this.data.updateData(this.registerForm.value.firstname,this.registerForm.value.lastname,this.registerForm.value.email);
      this.router.navigate(['signup/registration']);

      
    }
    this.submitted = true;
    
  }

} 
