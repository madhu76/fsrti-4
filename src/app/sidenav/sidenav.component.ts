import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}
const TREE_DATA: FoodNode[] = [
  {
    name: '2021',
    children: [
      {name: 'Volume 1, Issue 1'},
      {name: 'Volume 1, Issue 2'},
      {name: 'Volume 1, Issue 3'},
      {name: 'Volume 1, Issue 4'},
    ]
  },

  {
    name: '2022',
    children: [
      {name: 'Volume 2, Issue 1'},
      {name: 'Volume 2, Issue 2'},
      {name: 'Volume 2, Issue 3'},
      {name: 'Volume 2, Issue 4'}
    ]
  },
  {
    name: '2023',
    children: [
      {name: 'Volume 3, Issue 1'},
      {name: 'Volume 3, Issue 2'},
      {name: 'Volume 3, Issue 3'},
      {name: 'Volume 3, Issue 4'}
    ]
  }

];

  interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
  }

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor() {
    this.dataSource.data = TREE_DATA;
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
 
  }
  

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  showShortDesciption = true;


}
