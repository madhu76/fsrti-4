import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
  constructor(private formBuilder: FormBuilder, private router: Router) { }
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
      console.log(this.registerForm.value);
      if (this.isAuthor)
        this.router.navigate(['author']);
      return;
    }
    else {
      this.errorMessage = "Error";
    }
  }
  role(id) {
    console.log(id);
    if (id == 1) {
      this.isAuthor = true;
      this.isEditor = this.isPublisher = this.isReveiwer = this.isStaff = false;
      // console.log(this.isAuthor , this.isPublisher);

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
