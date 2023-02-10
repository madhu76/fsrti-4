import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../Services/api-data.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';


import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
interface FoodNode {
  name: string;
  children?: FoodNode[];
}
const TREE_DATA: FoodNode[] = [
  {
    name: '2021',
    children: [
      { name: 'Volume 1, Issue 1' },

    ]
  }];
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  original = "Original Research";
  isLoading = true;
  articles = [];
  select: any;
  Data: any = {};
  mostView = [];
  permission: string = "";

  constructor(private apiData: ApiDataService, public auth: AuthService, public router: Router, private activatedRoute: ActivatedRoute) { this.dataSource.data = TREE_DATA; }
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  ngOnInit(): void {
    this.getData();

    this.activatedRoute.queryParams.subscribe(params => {
      const itemId = params['item_id'];
      console.log("item id = ", itemId);
      this.apiData.getData(`/author/articles/${itemId}`)
        .subscribe((res: any) => {
          this.select = JSON.parse(res);
          this.Data = JSON.parse(res);
          // console.log("select = ",this.select);
          // this.isloading = false;
        });
      this.permission = localStorage.getItem("permission");
    });

  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  showShortDesciption = true;
  getData() {
    this.apiData.getData('/author/articles')
      .subscribe((result: any) => {
        this.articles = result;
        console.log(this.articles);
        this.isLoading = false;

        this.apiData.getData('/author/views')
          .subscribe((result: any) => {
            this.mostView = result;
            console.log(this.articles);

          })

      })
  }


  countDownloads() {
    // this.apiData.getData(`/author/articles/${fileurl}`)
    // console.log(e.target.parentElement,item.fileUrl);
    // e.target.parentElement.href=item.fileUrl;

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



