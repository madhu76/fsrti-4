import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { ApiDataService } from '../Services/api-data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  @ViewChild('aboutContent') aboutContent: ElementRef;

  isAdmin = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiDataService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.apiService.getData('/author/manuscript').subscribe({
        next: (response: { isAdmin?: boolean }) => {
          this.isAdmin = !!response.isAdmin;
        },
        error: () => {
          this.isAdmin = false;
        }
      });
    }
  }

  downloadAsWord(): void {
    if (!this.isAdmin || !this.aboutContent) {
      return;
    }

    const content = this.aboutContent.nativeElement.innerHTML;
    const html = '<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" '
      + 'xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
      + '<head><meta charset="utf-8"><title>About The Journal</title></head>'
      + '<body>' + content + '</body></html>';

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'About-The-Journal.doc';
    link.click();
    window.URL.revokeObjectURL(url);
  }

}
