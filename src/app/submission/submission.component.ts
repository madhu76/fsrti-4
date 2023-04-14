import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ManuscriptService } from '../manuscript.service';

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
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  adminForm: FormGroup;
  submitted = false;
  upload: File;
  articleData: any = {};
  constructor(private data: ManuscriptService, private formBuilder: FormBuilder) { this.dataSource.data = TREE_DATA; }
  get f() { return this.adminForm.controls; }
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



  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneno: ['', Validators.required],
      articlename: ['', Validators.required],
      authors: ['', Validators.required],
//       aboutauthor: ['', Validators.required],
      keywords: ['', Validators.required],
      abstract: ['', Validators.required],
      upload: ['', [Validators.required]],

    })
  }

  submit() {
    console.log('data ' + this.adminForm.value);
    alert("Saved Successfully")
    //this.manudata.image=this.file;
    this.data.articleData(this.adminForm.value);
    let formData = new FormData();
    formData.append("test", this.upload);
    console.log('file data  ' + formData);
    this.data.articleFileData(formData);
  }

}

