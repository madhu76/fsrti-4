import { Injectable } from '@angular/core';
import { FormArrayName } from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegistrationDataService {
public firstname= new BehaviorSubject<string>("lol");
public lastname= new BehaviorSubject<string>("lol");
public mail= new BehaviorSubject<string>("lol");
public password= new BehaviorSubject<string>("lol");
public username=new BehaviorSubject<string>("lol");
public middlename=new BehaviorSubject<string>("lol");
public title=new BehaviorSubject<string>("lol");
public phone=new BehaviorSubject<string>("lol");
public orcid=new BehaviorSubject<string>("lol");
public degree=new BehaviorSubject<string>("lol");
public institution=new BehaviorSubject<string>("lol");
public preferredname=new BehaviorSubject<string>("lol");
public department=new BehaviorSubject<string>("lol");
public city=new BehaviorSubject<string>("lol");
public country=new BehaviorSubject<string>("lol");
public position=new BehaviorSubject<string>("lol");
public address=new BehaviorSubject<string>("lol");
public postalcode= new BehaviorSubject<string>("lol");




public dfname=this.firstname.asObservable();
public dlname=this.lastname.asObservable();
public demail=this.mail.asObservable();
public dpassword= this.password.asObservable();
public dusername=this.username.asObservable();
public dmiddlename=this.middlename.asObservable();
public dtitle=this.title.asObservable();
public dphone=this.phone.asObservable();
public dorcid=this.orcid.asObservable();
public ddegree=this.degree.asObservable();
public dinstitution=this.institution.asObservable();
public dpreferredname=this.preferredname.asObservable();
public ddepartment=this.department.asObservable();
public dcity=this.city.asObservable();
public dcountry=this.country.asObservable();
public dposition=this.position.asObservable();
public daddress=this.address.asObservable();
public dpostalcode= this.postalcode.asObservable();

  constructor() { }
  updateData(fname,lname,email)
  {
    this.firstname.next(fname);
    this.lastname.next(lname);
    this.mail.next(email);
  }

  formData(username,password,title,degree,middlename,preferredname,orcid,institution,phone,position,address,department,city,postalcode,country)
  {
    this.password.next(password);
    this.username.next(username);
    this.title.next(title);
    this.degree.next(degree);
    this.middlename.next(middlename);
    this.preferredname.next(preferredname);
    this.orcid.next(orcid);
    this.institution.next(institution);
    this.phone.next(phone);
    this.position.next(position);
    this.address.next(address);
    this.department.next(department);
    this.postalcode.next(postalcode);
    this.city.next(city);
    this.country.next(country);
    
  }
}
