import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../Services/api-data.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AuthService } from '../Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import mappings from '../common/vol_issue_to_props_mapping'
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { HttpHeaders } from '@angular/common/http';
import { DownloadFileService } from '../Services/download-file.service';
import { FileUrlService } from '../Services/file-url.service';
import { NotificationService } from '../Services/notification.service';
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
  vol_issue = '';
  mostView = [];
  mappings:any = {};
  currArticles:any = [];
  isEditorialIssue:boolean = false; 
  publicViewVolumes: string[];

  isViewOnly(issue: string): boolean {
    return !!this.publicViewVolumes && this.publicViewVolumes.includes(String(issue).split('.')[0]);
  }

  constructor(private apiData: ApiDataService, public auth: AuthService,
    public router: Router, private activatedRoute: ActivatedRoute, private downloadFileService: DownloadFileService,
    private fileUrls: FileUrlService, private notifications: NotificationService) { this.dataSource.data = TREE_DATA;
    this.mappings = mappings;
    }
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
    this.fileUrls.publicViewVolumes$.subscribe(volumes => this.publicViewVolumes = volumes,
      error => this.notifications.backendError(error, 'Unable to load publication access settings.'));
    this.getData();
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  showShortDesciption = true;
  getData() {
     this.apiData.getData('/author/articles')
      .subscribe((result: any) => {
        this.articles = result;
        this.isLoading = false;
        this.activatedRoute.queryParams.subscribe(params => {
          this.vol_issue = params['vol_issue'];
          this.currArticles = this.articles.filter(article => article.vol_issue === this.vol_issue);
          this.isEditorialIssue = this.vol_issue==='1.1' || this.vol_issue=='3.2' || this.vol_issue==='3.3' || this.vol_issue == '4.2';
        }); 
        this.apiData.getData('/author/views')
          .subscribe((result: any) => {
            this.mostView = result;
          })

      })
  }
}



