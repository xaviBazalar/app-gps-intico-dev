import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import * as jQuery from 'jquery';

@Component({
  selector: 'app-reporte-diario',
  templateUrl: './reporte-diario.page.html',
  styleUrls: ['./reporte-diario.page.scss', '../../../assets/css/reportCalendar.css'],
  
})
export class ReporteDiarioPage implements OnInit {
  date: any;

  constructor() { 
    this.date = new Date().toString();
  }

  ngOnInit() {
    
  }

}
