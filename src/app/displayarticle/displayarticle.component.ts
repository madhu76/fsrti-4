import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { ApiDataService } from '../Services/api-data.service';
import { DownloadFileService } from '../Services/download-file.service';
import mappings from '../common/vol_issue_to_props_mapping'
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
  selector: 'app-displayarticle',
  templateUrl: './displayarticle.component.html',
  styleUrls: ['./displayarticle.component.css']
})
export class DisplayarticleComponent implements OnInit {
  select: any;
  Data: any = {};
  article: [];
  // id; 
  isloading = true;
  original = "Original Research";
  mappings: any = {};
  publicViewVolumes: string[];
  get viewOnly(): boolean {
    return !!this.publicViewVolumes && !!this.select &&
      this.publicViewVolumes.includes(String(this.select.vol_issue).split('.')[0]);
  }
  constructor(private activatedRoute: ActivatedRoute, private apidata: ApiDataService,
    private downloadFileService: DownloadFileService, private fileUrls: FileUrlService,
    private notifications: NotificationService) {
    this.dataSource.data = TREE_DATA;
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
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit() {
    this.fileUrls.publicViewVolumes$.subscribe(volumes => this.publicViewVolumes = volumes,
      error => this.notifications.backendError(error, 'Unable to load publication access settings.'));
    // console.log("on ng init ");

    this.activatedRoute.queryParams.subscribe(params => {
      const itemId = params['item_id'];
      console.log("item id = ", itemId);
      this.apidata.getData(`/author/articles/${itemId}`)
        .subscribe((res: any) => {
          this.select = JSON.parse(res);
          this.Data = JSON.parse(res);
          // console.log("select = ",this.select);
          this.isloading = false;
        });

    });

  }

  downloadFile(event: Event, item_id) {
    event.preventDefault();
    if (!this.publicViewVolumes || this.viewOnly) {
      this.notifications.warning('Downloads are unavailable. Please use View for public volumes.');
      return;
    }
    console.log("downloding mthod");
    // this.activatedRoute.queryParams.subscribe(params => {
    //   const itemId = params['item_id'];
    // this.apidata.getData(`/author/downloads/${itemId}`).subscribe();
    // })
    this.downloadFileService.downloadFileByItemId(item_id);
    this.apidata.getData(`/author/downloads/${item_id}`).subscribe();
  }
}
