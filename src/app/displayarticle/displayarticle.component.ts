import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {ActivatedRoute} from '@angular/router';
import { ApiDataService} from '../Services/api-data.service';
import { DownloadFileService } from '../Services/download-file.service';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}
const TREE_DATA: FoodNode[] = [
  {
    name: '2021',
    children: [
      {name: 'Volume 1, Issue 1'},

    ]
  }];
  interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
  }

@Component({
  selector: 'app-displayarticle',
  templateUrl: './displayarticle.component.html',
  styleUrls: ['./displayarticle.component.css']
})
export class DisplayarticleComponent implements OnInit {
select:any;
Data:any={};
article : [];
// id; 
isloading =  true;
original="Original Research";
  constructor(private activatedRoute: ActivatedRoute,private apidata: ApiDataService, private downloadFileService: DownloadFileService) 
              { this.dataSource.data = TREE_DATA;}
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
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(){
    // console.log("on ng init ");
    
    this.activatedRoute.queryParams.subscribe(params => {
      const itemId = params['item_id'];
      console.log("item id = ",itemId);
      this.apidata.getData(`/author/articles/${itemId}`)
        .subscribe((res:any) => {
          this.select = JSON.parse(res);
          this.Data = JSON.parse(res);
          // console.log("select = ",this.select);
          this.isloading = false;
        });
    
    });

  }

  downloadFile(event: Event,item_id)
  {
    event.preventDefault();
    console.log("downloding mthod");
    // this.activatedRoute.queryParams.subscribe(params => {
    //   const itemId = params['item_id'];
    // this.apidata.getData(`/author/downloads/${itemId}`).subscribe();
    // })
    this.downloadFileService.downloadFileByItemId(item_id);
    this.apidata.getData(`/author/downloads/${item_id}`).subscribe();
  }
}
