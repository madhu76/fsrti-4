import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  // url='http://localhost:3000';
  //url='https://epsbackend.herokuapp.com';
  url='https://jisst.vercel.app' 
  constructor(private http:HttpClient) { }

  getData(route) {
    return this.http.get(this.url + route);
  }

}
