import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  val = '';
  loginData: any = {};
  showModalLogin: boolean;
  showModalSignup: boolean;
  registerForm: FormGroup;
  submitted = false;
  loginformTitle = "Login ";
  signupformTitle = "SignUp";
  errorMessage = "";
  isAuthor = false;
  isEditor = false;
  isReveiwer = false;
  isStaff = false;
  isPublisher = false;
  password="password";
  password_21="password_21";
  password_22="password_22";
  
  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService) { }
  show(title) {
    this.loginformTitle = title;
    this.showModalLogin = true;
  }
  hide() {
    this.showModalLogin = false;
    this.showModalSignup = false;
  }
  showSignup(title) {
    this.showModalLogin = false;
    this.signupformTitle = title;
    this.showModalSignup = true;
  }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  get f() { return this.registerForm.controls; }
  onSubmit() {

    this.submitted = true;
    if (this.registerForm.valid) {
      this.showModalLogin = false;
      this.showModalSignup = false;
      this.loginData.username = this.registerForm.value.username;
      this.loginData.password = this.registerForm.value.password;
      //console.log(this.registerForm.value);
      // if(this.isAuthor)
      //   this.router.navigate(['author']);
      // return;
      
    }
    else {
      this.errorMessage = "Error";
    }
    
  }

  login(){
   
  }

  role(id) {
    // console.log(id);
    if (id == 1) {
      this.isAuthor = true;
      this.isEditor = this.isPublisher = this.isReveiwer = this.isStaff = false;
      this.auth.loginuserData(this.registerForm.value);
    }
    else if (id == 2) {
      this.isReveiwer = true;
      this.isEditor = this.isPublisher = this.isAuthor = this.isStaff = false;
    }
    else if (id == 3) {
      this.isEditor = true;
      this.isReveiwer = this.isPublisher = this.isAuthor = this.isStaff = false;
    }
    else if (id == 4) {
      this.isStaff = true;
      this.isReveiwer = this.isPublisher = this.isAuthor = this.isEditor = false;
    }
    else if (id == 5) {
      this.isPublisher = true;
      this.isReveiwer = this.isEditor = this.isAuthor = this.isStaff = false;
    }
  }

}
