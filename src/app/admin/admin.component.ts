import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ManuscriptService } from '../manuscript.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  adminForm: FormGroup;
  submitted = false;
  upload:File;
  articleData:any={};
  constructor(private data:ManuscriptService,private formBuilder: FormBuilder) { }
  get f() { return this.adminForm.controls; }
  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      upload:['',[Validators.required]],
      articlename:['',Validators.required],
      keywords:['',Validators.required],
      abstract:['',Validators.required],
      authors:['',Validators.required],
      aboutauthor:['',Validators.required],
      date:['',Validators.required]
  })
}
// submit()
// {
//   if(this.adminForm.valid)
//   {
//     console.log('article name'+this.adminForm.value.articlename);
//   }
//   else
//   console.log('not valid');
// }
submit() {
  console.log('data '+this.adminForm.value);
  alert("Saved Successfully")
  //this.manudata.image=this.file;
  this.data.articleData(this.adminForm.value);
  let formData = new FormData();
  formData.append("article", this.upload);
  console.log('file data  '+formData);
  this.data.articleFileData(formData);
}
}
