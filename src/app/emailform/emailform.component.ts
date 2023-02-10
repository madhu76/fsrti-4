import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

// import {NgForm} from '@angular/forms';
@Component({
  selector: 'app-emailform',
  templateUrl: './emailform.component.html',
  styleUrls: ['./emailform.component.css']
})
export class EmailformComponent implements OnInit {
 mail:any={}
 registerForm: FormGroup;
submitted=false
  constructor(private auth:AuthService,private formBuilder: FormBuilder,private route:Router ) { }

  ngOnInit(): void {
  
  this.registerForm = this.formBuilder.group({
   
    email: ['', [Validators.required, Validators.email]],
   
});
  }
get f() { return this.registerForm.controls; }
onSubmit() {
  // this.submitted = true;
  this.submitted = true;

  console.log('Your form data : ', this.registerForm.value.email);
  this.mail.email=this.registerForm.value.email;
  this.auth.emailform(this.mail);
  this.route.navigate(['/forgotpasswordemail']);
}
}
