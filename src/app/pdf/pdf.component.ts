import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import { ManuscriptService } from '../manuscript.service';
import { DomSanitizer } from '@angular/platform-browser';
import  jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {
  id: any;
  manudata:any={};
  manuFiledata:any={};
   subData:any={};
   subFileData:any={};
   variable_name;
  constructor(private authservice:AuthService,private manuscriptservice: ManuscriptService,private dom:DomSanitizer) { }

  ngOnInit(): void {
    this.id=this.authservice.sendId;
     console.log(`pdf `+this.id);
     this.manuscriptservice.getNewSubmissionData(this.id).subscribe(d => {
      this.manudata = d;
      console.log(`manudata in pdf `+(this.manudata));
      this.subData=JSON.parse(this.manudata);
    });

    this.manuscriptservice.getFileSubmissionData(this.id).subscribe(d => {
      this.manuFiledata = d;
      console.log(`file manudata in pdf `+(this.manuFiledata));
      this.subFileData=JSON.parse(this.manuFiledata);
    });
    
    this.variable_name=this.dom.bypassSecurityTrustResourceUrl(this.subFileData.avatar); 
    
  }
  download(){
    var ele=document.getElementById('table');
    html2canvas(ele).then((canvas)=>
    {
      console.log(canvas);
      var imgData= canvas.toDataURL('img/png')
      var doc= new jspdf()
      var imgHeight= canvas.height * 208 /canvas.width;

      doc.addImage(imgData,0,0,208,imgHeight)
      doc.save('MyPDF.pdf')
    })
  }
}


