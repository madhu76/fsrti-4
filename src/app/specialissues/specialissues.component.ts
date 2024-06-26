import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import specialissues from './specialissues'


@Component({
  selector: 'app-specialissues',
  templateUrl: './specialissues.component.html',
  styleUrls: ['./specialissues.component.css']
})
export class SpecialIssuesComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  public displayedIssues = [];
  public volIssue = undefined
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.volIssue = params['vol_issue'];
      if (this.volIssue === 'Published' || this.volIssue === 'Open') {
        // Sort based on submission deadline descending order
        this.displayedIssues = specialissues[this.volIssue].sort((a, b) => {
          return new Date(b.SubmissionDeadLine).getTime() - new Date(a.SubmissionDeadLine).getTime();
        });
      }
    });
  }
}



