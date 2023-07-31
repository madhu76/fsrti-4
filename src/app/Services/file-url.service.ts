import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUrlService {
  // url='http://localhost:3000';
  //url='https://epsbackend.herokuapp.com';
  url='https://ipallowlistjisst.azurewebsites.net/api/GetPdfUrl' 
  constructor(private http:HttpClient) { }

  getPdfUrlByItemId(item_id) {
    return this.http.get(this.url + '?item_id=' + item_id,{responseType : 'text'});
  }

}
