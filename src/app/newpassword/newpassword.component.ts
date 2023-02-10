import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css']
})
export class NewpasswordComponent implements OnInit {
  registerForm: FormGroup;
  token
  submitted=false
    constructor(private auth:AuthService,private formBuilder: FormBuilder ,private route:ActivatedRoute) { 
      this.route.params.subscribe(params => {
        
        console.log(params.id);
       this.token=params.id
      })
    }
   
   
    passwordPattern = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})';
 

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      password:['',[Validators.required,Validators.pattern(this.passwordPattern)]],
      conformPassword:['',[Validators.required]],
      
     
    })
  }

  get f(){
    return this.registerForm.controls;
  }

  onSubmit()
  {
    this.submitted=true;
    if(this.registerForm.valid )
    {
      //console.log(this.registrationForm.value);
      this.auth.formData(this.registerForm.value.password,this.token)
      // this.router.navigate(['signup/confirm']);
    }
  }

}
