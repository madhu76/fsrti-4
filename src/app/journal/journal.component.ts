import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ApiDataService } from '../Services/api-data.service';
import { announcements } from './announcement_data';

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
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})



export class JournalComponent implements OnInit {
  @ViewChild('scrollContent', { static: false }) scrollContent: ElementRef;

  articles = [];
  downloads = [];
  announcements = announcements
  scrollInterval: any = null;
  isScrolling: boolean = false;
  constructor(private apiData: ApiDataService) {
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
    this.getData();
  }

  ngAfterViewInit() {
    this.startScrolling()
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  showShortDesciption = true;

  startScrolling(resumeScrolling = false) {
    if (this.isScrolling) {
      return;  // Prevent multiple intervals from being created
    }

    this.isScrolling = true;

    const scrollContent = this.scrollContent.nativeElement;
    let totalHeight = scrollContent.scrollHeight;
    if (!resumeScrolling) {
      scrollContent.style.top = '100%';
    }

    const scroll = () => {
      if (parseInt(scrollContent.style.top) < -totalHeight) {
        scrollContent.style.top = '100%';
      }
      scrollContent.style.top = parseInt(scrollContent.style.top) - 1 + 'px';
    };

    this.scrollInterval = setInterval(scroll, 30);
  }
  
  @HostListener('mouseenter')
  pauseScrolling() {
    if (this.isScrolling) {
      clearInterval(this.scrollInterval);
      this.isScrolling = false;
    }
  }
  @HostListener('mouseleave')
  resumeScrolling() {
    this.startScrolling(true);
  }

  alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption
  }

  getData() {
    this.apiData.getData('/author/download')
      .subscribe((result: any) => {
        this.downloads = result;
        console.log(this.articles);
      })
    this.apiData.getData('/author/articles')
      .subscribe((result: any) => {
        this.articles = result;
        console.log(this.articles);

      })
  }


}
