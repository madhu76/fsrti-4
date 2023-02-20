import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiDataService } from '../Services/api-data.service';
// import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-vol1-issue2',
  templateUrl: './vol1-issue2.component.html',
  styleUrls: ['./vol1-issue2.component.css']
})

export class Vol1Issue2Component implements OnInit {
  original="Original Research";
  isLoading = true;
  articles  = [];
  select:any;
  Data:any={};
  mostView = [];
  permission:string="";

  
  constructor(private apiData: ApiDataService,public auth:AuthService,public router:Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getData();

    this.activatedRoute.queryParams.subscribe(params => {
      const itemId = params['item_id'];
      console.log("item id = ",itemId);
      this.apiData.getData(`/author/articles/${itemId}`)
        .subscribe((res:any) => {
          this.select = JSON.parse(res);
          this.Data = JSON.parse(res);
          // console.log("select = ",this.select);
          // this.isloading = false;
        });
      this.permission=localStorage.getItem("permission");
    
    });
    
  }

  getData() {
    this.apiData.getData('/author/articles')
    .subscribe((result:any)=>{
      this.articles = result;
      console.log(this.articles);
      this.isLoading = false;

      this.apiData.getData('/author/views')
      .subscribe((result:any)=>{
      this.mostView = result;
      console.log(this.articles);

  })

    })
  }
 
  countDownloads()
  {
    console.log("downloding mthod");
    this.activatedRoute.queryParams.subscribe(params => {
      const itemId = params['item_id'];
      this.apiData.getData(`/author/downloads/${itemId}`).subscribe();
    })
  }
  
  
   password() {
    var password = prompt("Please enter the password");
    if (password === "fsrti@23") {
      document.getElementById('downloadpass').click();
    }
    else {
      alert("Password incorrect");
    }
  }
}



