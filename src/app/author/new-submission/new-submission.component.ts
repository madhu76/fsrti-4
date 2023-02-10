import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ManuscriptService } from '../../manuscript.service';
import {AuthService} from '../../auth.service';
interface Articles {
  value: string;
  viewValue: string;
}
interface Files {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-submission',
  templateUrl: './new-submission.component.html',
  styleUrls: ['./new-submission.component.css']
})
export class NewSubmissionComponent implements OnInit {
  AuthorForm: FormGroup;
  ArticleTypeGroup: FormGroup;
  TitleGroup: FormGroup;
  // AuthorGroup: FormGroup;
  AttachFilesGroup: FormGroup;
  AdditionalInfoGroup: FormGroup;
  CommentsGroup: FormGroup;
  ManuscriptGroup: FormGroup;

  //files
  check1: boolean = false;
  check2: boolean = false;
  check3: boolean = false;
  i = 0;
  selected = 'Cover Letter';
  storedisplayfiles: any = [];
  displayfiles: any = [];
  allfiles: any = [];
  sendingFile: File;
  file: File;
  imageUrl: string | ArrayBuffer = "https://bulma.io/images/placeholders/480x480.png";
  article: Articles[] = [
    { value: 'ResearchPaper-0', viewValue: 'Research Paper' },
    { value: 'ReviewPaper-1', viewValue: 'Review Paper' },
    { value: 'CaseStudyPaper-2', viewValue: 'CaseStudy Paper' },
    { value: 'RegularArticle-3', viewValue: 'Regular Article' },
    { value: 'SurveyPaper-2', viewValue: 'Survey Paper' }
  ];
  files: Files[] = [
    { value: 'Cover Letter', viewValue: 'Cover Letter' },
    { value: 'Manuscript File', viewValue: 'Manuscript File' },
    { value: 'Conflict of Interest', viewValue: 'Conflict of Interest' },
  ];
  articleType: '';
  title: '';
  isFunded: false;
  isDualPublicationStatement: false;
  comments: '';
  abstract: '';
  keywords: '';
  submitted = false;
  manudata: any = {};
  authordata = {};
  authorsData:any = [];
  id:String;
  constructor(private _formBuilder: FormBuilder, private manuscriptservice: ManuscriptService, private authservice:AuthService) {

  }

  ngOnInit(): void {
    this.AuthorForm = this._formBuilder.group({
      auth_firstname: ['', [Validators.required, Validators.minLength(2)]],
      auth_middlename: ['', [Validators.required, Validators.minLength(6)]],
      auth_lastname: ['', [Validators.required, Validators.minLength(6)]],
      degree: ['', [Validators.required, Validators.minLength(6)]],
      affiliation: ['', [Validators.required, Validators.minLength(6)]],
      auth_email: ['', [Validators.required, Validators.minLength(6)]],
      checkauthor: ['', [Validators.requiredTrue]],

    });

    this.ArticleTypeGroup = this._formBuilder.group({
      ArticleTypeCtrl: ['', Validators.required]
    });
    this.TitleGroup = this._formBuilder.group({
      TitleCtrl: ['', Validators.required]
    });

  }
  onSubmit() {
    this.authorsData.push(this.AuthorForm.value);
    this.manudata.authorsData = this.authorsData;
    alert('Author added');
    // alert(JSON.stringify(this.manudata.authorsData[0].auth_firstname));

    this.AuthorForm.reset();
  }
  
  deleteauthor(d: any) {
    const index = this.manudata.authorsData.indexOf(d);
    this.manudata.authorsData.splice(index, 1);
    // this.allfiles.splice(index, 1);
  }

  onChange(file: File) {

    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
console.log(this.file);
      };
    }
  }
  fileuploads(event) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = {
          name: '',
          type: '',
          size: '',
          url: '',
          sel: ''

        };
        this.allfiles.push(files[i]);
        file.sel = this.selected;
        if (file.sel == '*Cover Letter')
          this.check1 = true;
        else if (file.sel == '*Manuscript File')
          this.check2 = true;
        else if (file.sel == '*Conflict of Interest')
          this.check3 = true;

        file.name = files[i].name;
        file.type = files[i].type;
        const size = files[i].size / 1000;
        const mbc = size + '';
        const mb = mbc.split('.')[0];
        const length = mb.length;
        if (length === 4 || length === 5) {
          const mbsize = size / 1000;
          const splitdata = mbsize + '';
          const splitvalues = splitdata.split('.');
          let secondvariable = '';
          for (let j = 0; j < splitvalues.length; j++) {
            if (j === 1) {
              secondvariable = splitvalues[j].slice(0, 2);
            }
          }
          file.size = splitvalues[0] + '.' + secondvariable + 'MB';
        }
        else {

          const splitdata = size + '';
          const splitvalues = splitdata.split('.');
          let secondvariable = '';
          for (let j = 0; j < splitvalues.length; j++) {
            if (j === 1) {
              secondvariable = splitvalues[j].slice(0, 2);
            }
          }
          file.size = splitvalues[0] + '.' + secondvariable + 'KB';

        }

        const reader = new FileReader();
        reader.onload = (filedata) => {
          file.url = reader.result + '';
          this.storedisplayfiles.push(file);
        }
        reader.readAsDataURL(files[i]);
      }
    }
    event.srcElement.value = null;
    console.log(this.allfiles);
  }

  deletefile(file: any) {
    const index = this.displayfiles.indexOf(file);
    this.displayfiles.splice(index, 1);
    this.allfiles.splice(index, 1);
  }
  save() {
    // if (this.storedisplayfiles[this.i].name) {
  {    this.displayfiles[this.i] = this.storedisplayfiles[this.i];
      this.i = this.i + 1;
    }
  }
  submit(formObj: NgForm) {
    console.log(this.manudata);
    alert("Saved Successfully")
    //this.manudata.image=this.file;
    this.manuscriptservice.sendmanudata(this.manudata);
    let formData = new FormData();

    let userObj = formObj.value;

    formData.append("image", this.file);
    this.manuscriptservice.sendfiledata(formData);

  }

  build()
  {
    let id =this.authservice.getId;
  }

}
