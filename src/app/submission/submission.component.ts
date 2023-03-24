import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  
  formsubmit(){
    console.warn(this.registerForm);
  } 
  registerForm = new FormGroup({
      name: new FormControl("",[Validators.required]),
      Email: new FormControl("",[Validators.required]),
      phone_no: new FormControl("",[Validators.required]),
      country: new FormControl("",[Validators.required]),
      jour: new FormControl("",[Validators.required]),
      Article_name: new FormControl("",[Validators.required]),
      Author: new FormControl("",[Validators.required]),
      file: new FormControl("",[Validators.required]),
      captcha: new FormControl("",[Validators.required]),
      Message: new FormControl("",[Validators.required]),

  })
  siteKey: string;
  
  
  title = 'forms';
  get Name(): FormControl{
    return this.registerForm.get("name") as FormControl;
  }
  get Email(): FormControl{
    return this.registerForm.get("Email") as FormControl;
  }
  get Phone_no(): FormControl{
    return this.registerForm.get("phone_no") as FormControl;
  }
  get country(): FormControl{
    return this.registerForm.get("country") as FormControl;
  }
  get jour(): FormControl{
    return this.registerForm.get("jour") as FormControl;
  }
  get Article_name(): FormControl{
    return this.registerForm.get("Article_name") as FormControl;
  }
  get Author(): FormControl{
    return this.registerForm.get("Author") as FormControl;
  }
  get file(): FormControl{
    return this.registerForm.get("file") as FormControl;
  }
  get captcha(): FormControl{
    return this.registerForm.get("captcha") as FormControl;
  }
  get Message(): FormControl{
    return this.registerForm.get("Message") as FormControl;
  }

  constructor() { this.dataSource.data = TREE_DATA;
    this.siteKey = "6Lf0xCYlAAAAAMKLp18T_I4MouTxIN3-aw0k_8Eb"
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

  ngOnInit(): void {
  }

}
