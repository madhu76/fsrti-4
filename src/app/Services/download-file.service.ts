import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileUrlService } from './file-url.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {
  // url='http://localhost:3000';
  //url='https://epsbackend.herokuapp.com';
  constructor(private http:HttpClient, private fileUrlService: FileUrlService) { }

  downloadFileByItemId(item_id) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    this.fileUrlService.getPdfUrlByItemId(item_id).subscribe((res: any) => {
      this.http.get(res, { headers: headers, responseType: 'blob' }).subscribe((data) => {
        // Create blob link to download
        const blob = new Blob([data], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = 'download.pdf'; // You can also get the file name from response headers
        link.download = fileName;
        link.click();

        // To ensure that the object URL gets released (avoiding memory leaks), revoke it after the link click
        window.URL.revokeObjectURL(url);
      });
    }, (error) => {alert(error.error)});
}

}
