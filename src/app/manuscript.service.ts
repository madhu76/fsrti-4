import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ManuscriptService {


  constructor(private http: HttpClient) { }
  item_id;
  url='https://jisst.vercel.app'
  //url = 'https://epsbackend.herokuapp.com';
  //url = 'http://localhost:5000';
  newsubmissiondata: any = {};

  sendmanudata(manudata) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,

      })
    let options = { headers: headers };
    this.http.post<any>(this.url + '/author/newsubmission', (manudata), options).subscribe(res => {
      console.log(res)
    },
      err => {
        console.log(err.message);
      })
  }
  sendfiledata(filedata) {

    this.http.post<any>(this.url + '/author/newfilesubmission', (filedata)).subscribe(res => {
      console.log(res)
    },
      err => {
        console.log(err.message);
      })
  }

  getNewSubmissionData(id) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,

      })
    let options = { headers: headers };
    return this.http.get(this.url + `/author/newsubmission/${id}`, options)
  }
  getFileSubmissionData(id) {
    return this.http.get(this.url + `/author/newfilesubmission/${id}`)
  }

  getArticleData(id) {
    console.log(id);
    this.item_id = id
    return this.http.get(this.url + `/author/articles/${id}`);
  }


  Data() {
    return this.newsubmissiondata;
  }
  articleData(data) {
    console.log(data);
    return this.http.post<any>(this.url + '/author/articlesubmission', (data)).subscribe(res => {
      console.log(res)
    },
      err => {
        console.log(err.message);
      })
  }

  articleFileData(article) {
    console.log(article);
    this.http.post<any>(this.url + '/author/articlefilesubmission', (article)).subscribe(res => {
      console.log(res)
    },
      err => {
        console.log(err.message);
      })
  }


}
