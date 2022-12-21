import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import * as $ from 'jquery'
import * as jQuery from 'jquery';
import { DOCUMENT } from '@angular/common';
import { TaskEventsModel } from '../../models/taskEvents'
import { TaskService } from 'src/app/services/task.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { parse } from 'path';
import { StorageService } from 'src/app/services/storage.service';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { EvidenceService } from 'src/app/services/evidence.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-reporte-diario',
  templateUrl: './reporte-diario.page.html',
  styleUrls: ['./reporte-diario.page.scss', '../../../assets/css/reportCalendar.css'],
  
})

export class ReporteDiarioPage implements OnInit {
	private window: any;
	transitionEnd:string= 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
	transitionsSupported:any
	date: any;
	element:any
	timeline:any
	timelineItems:any
	timelineItemsNumber:any
	timelineStart:any
	timelineUnitDuration:any
	eventsWrapper:any
	eventsGroup:any
	singleEvents:any
	eventSlotHeight:any
	modal:any
	modalHeader:any
	modalHeaderBg:any
	modalBody:any
	modalBodyBg:any
	modalMaxWidth:any
	modalMaxHeight:any
	animating:any
	objSchedulesPlan = []
	windowResize = false;
	fechaSeleccionada:any=""
	cmbMaquina:any
	listaHorasActivas:any=[]

	listaEventos: Array<TaskEventsModel> = [];
	idMachine: String | null = '';
	item: any[] = []; 

	@Input() page;
	idUser: String = '';
	
  constructor(@Inject(DOCUMENT) private document: Document, 
  				private taskService: TaskService, 
				private machineService: MaquinariaService,
				private route: ActivatedRoute,
				private router: Router,
				private storageService: StorageService,
				private evidenceService:EvidenceService,
				public alertController: AlertController,
				public loadingController: LoadingController
				) { 
    this.window = this.document.defaultView;
    this.date = new Date().toString();
    //this.transitionsSupported=( $('.csstransitions').length > 0 );
    if( !this.transitionsSupported ) this.transitionEnd = 'noTransition';
  }

  @HostListener('unloaded')
  ionViewWillLeave(){
	  console.log("me movi")
	  
  }

  ShowLoading() {
    this.loadingController.create({
        message: 'Cargando...'
    }).then((response) => {
        response.present();
    });
  } 
  
  dismissLoading() {
    this.loadingController.dismiss().then((response) => {
        //console.log('Loader closed!', response);
    }).catch((err) => {
        console.log('Error occured : ', err);
    });
  }

  async ngOnInit():Promise<void> {
	await this.storageService.init()
	const [user] = await Promise.all([this.storageService.loadUser()]);
    const dataUser = user;
	this.idUser = dataUser[0].uid;

	// console.log("iduser", idUser);

	this.machineService.getMachine(this.idUser).subscribe((data:any) => {
        // console.log('idUser', idUser);
        const { machine } = data;
		// console.log(machine);
        // console.log('tarea', task);
        for (let index = 0; index < machine.length; index++) {
          const _item = {nombre: machine[index].descripcion, 
						 value: machine[index].uid
          				};
          // console.log(_item );
          this.item.push( _item );        
        }
      });
  }
  

async generarHtml(fecha, machine) {
	console.log('Armado del html')
	this.fechaSeleccionada=fecha
	let html: string = '<ul class="wrap">';
	console.log("fecha",fecha)
	this.taskService.getTaskEventReporte(fecha, machine).subscribe(async (data: any) => {
		const { taskEvent } = data;
		const div = document.getElementById('divEventos');
		console.log(taskEvent)
		if(data.ok==false){
			div!.innerHTML = "";
			this.dismissLoading()
			return;
		}
		
		//para los gps
		html += `<li class="events-group">
				<div class="top-info"><span>GPS</span></div>
				<ul>`;
		this.listaHorasActivas=[]
		for (let i = 0; i < taskEvent.length; i++) {
			let dataevent: string = 'event-5';

			let ini:any=taskEvent[i].horaInicio
			let fin:any=taskEvent[i].horaFin
			let dateA:any=new Date(`10/10/2022 ${ini}`)
			let dateB:any=new Date(`10/10/2022 ${fin}`)
			let diff=(dateA-dateB)*-1
			let hora:any=String(diff/3600000)
			let minutos:any="0"
			if(Number.isInteger(hora)){
				//console.log("horas",hora)
			}else{
				let dataTime:any=hora.split(".")
				let minTemp:any=parseFloat("0."+dataTime[1])
				minutos=minTemp*60
				hora=dataTime[0]
				console.log("horas",dataTime[0])
				console.log("minutos",parseInt(minutos))
			}
			this.listaHorasActivas.push({
				inicio:taskEvent[i].horaInicio.replace(":",""),
				fin:taskEvent[i].horaFin.replace(":",""),
				tarea:taskEvent[i].task,
				maquinainterna:taskEvent[i].machine.idInterno,
				maquina:taskEvent[i].machine._id,
				fecha:taskEvent[i].fechaRegistro.substr(0,10),
				uid:taskEvent[i].uid
			})
			html += `<li class="single-event" data-start="${ taskEvent[i].horaInicio }" data-end="${ taskEvent[i].horaFin }" data-content="event-abs-circuit" data-event="${ dataevent }">`;
			html +=`<a href="#0" data-order="1" data-uid="${ taskEvent[i].uid }">
			GPS<br>
			<span class="detalle-op">Uso: ${hora} Hrs ${Math.ceil(minutos)} min</span>
				</a></li>`
			
		}
		html += `</ul></li>`;


		//para los eventos
		html += `<li class="events-group">
				<div class="top-info"><span>Eventos</span></div>
				<ul>`;
		for (let i = 0; i < taskEvent.length; i++) {
			let dataevent: string = '';

			switch(taskEvent[i].tipo){
				case 'Operativo':
					dataevent = 'event-1';
					break;
				case 'Pausa':
					dataevent = 'event-4';
					break;
				case 'Detencion':
					dataevent = 'event-3';
					break;
			}

			let ini:any=taskEvent[i].horaInicio
			let fin:any=taskEvent[i].horaFin
			let dateA:any=new Date(`10/10/2022 ${ini}`)
			let dateB:any=new Date(`10/10/2022 ${fin}`)
			let diff=(dateA-dateB)*-1
			let hora:any=String(diff/3600000)
			let minutos:any="0"
			if(Number.isInteger(hora)){
				//console.log("horas",hora)
			}else{
				let dataTime:any=hora.split(".")
				let minTemp:any=parseFloat("0."+dataTime[1])
				minutos=minTemp*60
				hora=dataTime[0]
				console.log("horas",dataTime[0])
				console.log("minutos",parseInt(minutos))
			}

			/*
			componentProps: {
				idTarea: this.idTarea,
				idMaquinaInterna: this.idMaquinaInterna,
				idMaquina: this.idMaquina
			}
			*/

			if(taskEvent[i].tipo === 'Operativo'){
				dataevent = 'event-1'
			}

			let dataRetorno:string=`;idTarea=${taskEvent[i].task};machine=${taskEvent[i].machine._id};fecha=${fecha};`
			this.storageService.saveDataRetorno(dataRetorno)
			this.storageService.saveDataRetornoMaquina("")
			html += `<li class="single-event" data-start="${ taskEvent[i].horaInicio }" data-end="${ taskEvent[i].horaFin }" data-content="event-abs-circuit" data-event="${ dataevent }">`;
			html +=`<a href="#0" 
					data-order="2" 
					data-tipo="${taskEvent[i].tipo}"
					data-subtipo="${taskEvent[i].subTipo}"
					data-tarea="${taskEvent[i].task}" 
					data-maquinainterna="${taskEvent[i].machine.idInterno}" 
					data-maquina="${taskEvent[i].machine._id}" 
					data-uid="${ taskEvent[i].uid }">
					${ taskEvent[i].tipo }<span class="detalle-op">(${ taskEvent[i].subTipo }) ${hora} Hrs ${Math.ceil(minutos)} min</span>

					</a>
				</li>`
		}//<br><em class="event-name">&emsp;${ taskEvent[i].tipo }</em><br>&emsp;${ taskEvent[i].subTipo }
		html += `</ul></li>`;
		
		//para las evidencias
		html += `<li class="events-group">
				<div class="top-info"><span>Evidencias</span></div>
				<ul>`;
		for (let i = 0; i < taskEvent.length; i++) {
			let dataevent: string = 'event-2';
			console.log(taskEvent[i].uid)
			const data:any = await this.evidenceService.obtenerEvidence(taskEvent[i].uid).toPromise()
			console.log("evidencia",data)
			if(data.ok){			
				html += `<li class="single-event"  data-start="${ taskEvent[i].horaFin }" data-end="${ taskEvent[i].horaFin }" data-content="event-abs-circuit" data-event="${ dataevent }">`;
				html +=`<a href="#2" data-order="3" data-uid="${ taskEvent[i].uid }" >
							<ion-button color="tertiary" >
								<ion-icon name="caret-down-outline"></ion-icon>
						</ion-button>
						</a>
						</li>`
			}
		}
		html += `</ul></li>`;

		html += `</ul>
		<style>
		.detalle-op{
			display:block !important;
			font-size:10px;
			line-height: 12px;
		}

		.codyhouse {
			text-align: center;
			margin: 40px 0;
		  }
		  /* reset css */
		  /* https://meyerweb.com/eric/tools/css/reset/ 
			 v2.0 | 20110126
			 License: none (public domain)
		  */
		  
		  html, body, div, span, applet, object, iframe,
		  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
		  a, abbr, acronym, address, big, cite, code,
		  del, dfn, em, img, ins, kbd, q, s, samp,
		  small, strike, strong, sub, sup, tt, var,
		  b, u, i, center,
		  dl, dt, dd, ol, ul, li,
		  fieldset, form, label, legend,
		  table, caption, tbody, tfoot, thead, tr, th, td,
		  article, aside, canvas, details, embed, 
		  figure, figcaption, footer, header, hgroup, 
		  menu, nav, output, ruby, section, summary,
		  time, mark, audio, video {
			  margin: 0;
			  padding: 0;
			  border: 0;
			  font-size: 100%;
			  font: inherit;
			  vertical-align: baseline;
		  }
		  /* HTML5 display-role reset for older browsers */
		  article, aside, details, figcaption, figure, 
		  footer, header, hgroup, menu, nav, section, main {
			  display: block;
		  }
		  body {
			  line-height: 1;
		  }
		  ol, ul {
			  list-style: none;
		  }
		  blockquote, q {
			  quotes: none;
		  }
		  blockquote:before, blockquote:after,
		  q:before, q:after {
			  content: '';
			  content: none;
		  }
		  table {
			  border-collapse: collapse;
			  border-spacing: 0;
		  }
		  
		  /* style css */
		  /* -------------------------------- 
		  
		  Primary style
		  
		  -------------------------------- */
		  *, *::after, *::before {
			box-sizing: border-box;
		  }
		  
		  html {
			font-size: 62.5%;
		  }
		  
		  body {
			font-size: 1.6rem;
			font-family: "Source Sans Pro", sans-serif;
			color: #222222;
			background-color: white;
		  }
		  
		  a {
			color: #A2B9B2;
			text-decoration: none;
		  }
		  
		  /* -------------------------------- 
		  
		  Main Components 
		  
		  -------------------------------- */
		  .cd-schedule {
			position: relative;
			margin: 2em 0;
		  }
		  
		  .cd-schedule::before {
			/* never visible - this is used in js to check the current MQ */
			content: 'mobile';
			display: none;
		  }
		  
		  @media only screen and (max-width: 580px) {
			.cd-schedule {
			  width: 90%;
			  max-width: 1400px;
			  margin: 2em auto;
			}
			.cd-schedule::after {
			  clear: both;
			  content: "";
			  display: block;
			}
			.cd-schedule::before {
			  content: 'desktop';
			}
		  }
		  
		  /* .cd-schedule .timeline {
			display: none;
		  } */
		  
		  @media only screen and (max-width: 580px) {
			.cd-schedule .timeline {
			  display: block;
			  position: absolute;
			  top: 0;
			  left: 0;
			  height: 100%;
			  width: 100%;
			  padding-top: 50px;
			}
			.cd-schedule .timeline li {
			  position: relative;
			  height: 50px;
			}
			.cd-schedule .timeline li::after {
			  content: '';
			  position: absolute;
			  bottom: 0;
			  left: 0;
			  width: 100%;
			  height: 1px;
			  background: #EAEAEA;
			}
			/* .cd-schedule .timeline li:last-of-type::after {
			  display: none;
			}
			.cd-schedule .timeline li span {
			  display: none;
			} */
		  }
		  
		  @media only screen and (max-width: 500px) {
			.cd-schedule .timeline li::after {
			  width: calc(100% - 60px);
			  left: 60px;
			}
			.cd-schedule .timeline li span {
			  display: inline-block;
			  -webkit-transform: translateY(-50%);
				  -ms-transform: translateY(-50%);
					  transform: translateY(-50%);
			}
			/* .cd-schedule .timeline li:nth-of-type(2n) span {
			  display: none;
			} */
		  }
		  
		  .cd-schedule .events {
			position: relative;
			z-index: 1;
		  }
		  
		  .cd-schedule .events .events-group {
			margin-bottom: 30px;
			padding:6px
		  }
		  
		  .cd-schedule .events .top-info {
			width: 100%;
			padding: 0 5%;
		  }
		  
		  .cd-schedule .events .top-info > span {
			display: inline-block;
			line-height: 1.2;
			margin-bottom: 10px;
			font-weight: bold;
		  }
		  
		  .cd-schedule .events .events-group > ul {
			position: relative;
			padding: 0 5%;
			/* force its children to stay on one line */
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			overflow-x: scroll;
			-webkit-overflow-scrolling: touch;
		  }
		  
		  .cd-schedule .events .events-group > ul::after {
			/* never visible - used to add a right padding to .events-group > ul */
			display: inline-block;
			content: '-';
			width: 1px;
			height: 100%;
			opacity: 0;
			color: transparent;
		  }
		  
		  .cd-schedule .events .single-event {
			/* force them to stay on one line */
			-ms-flex-negative: 0;
				flex-shrink: 0;
			float: left;
			height: 150px;
			width: 70%;
			max-width: 300px;
			/*box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.2);*/
			margin-right: 20px;
			-webkit-transition: opacity .2s, background .2s;
			transition: opacity .2s, background .2s;
		  }
		  
		  .cd-schedule .events .single-event:last-of-type {
			margin-right: 5%;
		  }
		  
		  .cd-schedule .events .single-event a {
			display: block;
			height: 100%;
			padding: 0px;
		  }
		  
		  /* @media only screen and (min-width: 550px) {
			.cd-schedule .events .single-event {
			  width: 40%;
			}
		  } */
		  
		  @media only screen and (max-width: 580px) {
			.cd-schedule .events {
			  float: left;
			  width: 100%;
			}
			.cd-schedule .events .events-group {
			  width: 44%;
			  float: left;
			  border: 1px solid #EAEAEA;
			  /* reset style */
			  margin-bottom: 0;
			}
			.cd-schedule .events .events-group:not(:first-of-type) {
			  border-left-width: 0;
			}
			.cd-schedule .events .top-info {
			  /* vertically center its content */
			  display: table;
			  height: 50px;
			  border-bottom: 1px solid #EAEAEA;
			  /* reset style */
			  padding: 0;
			}
			.cd-schedule .events .top-info > span {
			  /* vertically center inside its parent */
			  display: table-cell;
			  vertical-align: middle;
			  padding: 0 .5em;
			  text-align: center;
			  /* reset style */
			  font-weight: normal;
			  margin-bottom: 0;
			}
			.cd-schedule .events .events-group > ul {
			  height: 950px;
			  /* reset style */
			  display: block;
			  overflow: visible;
			  padding: 0;
			}
			.cd-schedule .events .events-group > ul::after {
			  clear: both;
			  content: "";
			  display: block;
			}
			/* .cd-schedule .events .events-group > ul::after {
			  display: none;
			} */
			.cd-schedule .events .single-event {
			  position: absolute;
			  z-index: 3;
			  /* top position and height will be set using js */
			  width: calc(100% + 2px);
			  left: -1px;
			  /*box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), inset 0 -3px 0 rgba(0, 0, 0, 0.2);*/
			  /* reset style */
			  -ms-flex-negative: 1;
				  flex-shrink: 1;
			  height: auto;
			  max-width: none;
			  margin-right: 0;
			  opacity: 1 !important;
			  border-radius: 10px;
			  color: #fff;
			  padding: 10px;
			  line-height: 20px;
			}
			.cd-schedule .events .single-event a {
			  /*padding: 1.2em;*/
			  
			}
			.cd-schedule .events .single-event:last-of-type {
			  /* reset style */
			  margin-right: 0;
			}
			.cd-schedule .events .single-event.selected-event {
			  /* the .selected-event class is added when an user select the event */
			  visibility: hidden;
			}
		  }
		  
		  @media only screen and (max-width: 500px) {
			.cd-schedule .events {
			  /* 60px is the .timeline element width */
			  width: calc(100% - 60px);
			  margin-left: 76;
			}
		  }
		  
		  .cd-schedule.loading .events .single-event {
			/* the class .loading is added by default to the .cd-schedule element
				 it is removed as soon as the single events are placed in the schedule plan (using javascript) */
			opacity: 0;
		  }
		  
		  .cd-schedule .event-name,
		  .cd-schedule .event-date {
			display: block;
			color: white;
			font-weight: bold;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		  }
		  
		  .cd-schedule .event-name {
			font-size: 2.4rem;
		  }
		  
		  @media only screen and (max-width: 580px) {
			.cd-schedule .event-name {
			  font-size: 2rem;
			}
		  }
		  
		  .cd-schedule .event-date {
			/* they are not included in the the HTML but added using JavScript */
			font-size: 1.4rem;
			opacity: .7;
			line-height: 1.2;
			margin-bottom: .2em;
		  }
		  
		  .cd-schedule .single-event[data-event="event-1"],
		  .cd-schedule [data-event="event-1"] .header-bg {
			/* this is used to set a background color for the event and the modal window */
			background: #599842;
			color: #fff;
			padding: 10px;
			line-height: 20px;
		  }
		  
		  .cd-schedule .single-event[data-event="event-1"]:hover {
			background: #599840;
		  }
		  
		  .cd-schedule .single-event[data-event="event-2"],
		  .cd-schedule [data-event="event-2"] .header-bg {
			background: transparent;
    		box-shadow: none;
		  }
		  
		  .cd-schedule .single-event[data-event="event-2"]:hover {
			background: transparent;
    		box-shadow: none;
		  }
		  
		  .cd-schedule .single-event[data-event="event-3"],
		  .cd-schedule [data-event="event-3"] .header-bg {
			background: #900A0A;
		  }
		  
		  .cd-schedule .single-event[data-event="event-3"]:hover {
			background: #900A0A;
		  }
		  
		  .cd-schedule .single-event[data-event="event-4"],
		  .cd-schedule [data-event="event-4"] .header-bg {
			background: #C8B724;
		  }
		  
		  .cd-schedule .single-event[data-event="event-4"]:hover {
			background: #C8B724;
		  }
		  
		  .cd-schedule .single-event[data-event="event-5"],
		  .cd-schedule [data-event="event-5"] .header-bg {
			background: #D9D9D9;
		  }

		  .cd-schedule .single-event[data-event="event-5"] span{
			  display:none;
		  }
		  
		  .cd-schedule .single-event[data-event="event-5"] a{
			color:#000000;
		  }

		  .cd-schedule .single-event[data-event="event-5"],
		  .cd-schedule [data-event="event-5"] .event-date{
			color:#000 !important;
		  }
		  
		  .cd-schedule .single-event[data-event="event-5"]:hover {
			background: #EAECEE;
		  }
		
		  .cd-schedule .event-modal {
			position: fixed;
			z-index: 3;
			top: 0;
			right: 0;
			height: 100%;
			width: 100%;
			visibility: hidden;
			/* Force Hardware acceleration */
			-webkit-transform: translateZ(0);
					transform: translateZ(0);
			-webkit-transform: translateX(100%);
				-ms-transform: translateX(100%);
					transform: translateX(100%);
			-webkit-transition: visibility .4s, -webkit-transform .4s;
			transition: visibility .4s, -webkit-transform .4s;
			transition: transform .4s, visibility .4s;
			transition: transform .4s, visibility .4s, -webkit-transform .4s;
			-webkit-transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
					transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
		  }
		  
		  .cd-schedule .event-modal .header {
			position: relative;
			height: 70px;
			/* vertically center its content */
			display: table;
			width: 100%;
		  }
		  
		  .cd-schedule .event-modal .header .content {
			position: relative;
			z-index: 3;
			/* vertically center inside its parent */
			display: table-cell;
			vertical-align: middle;
			padding: .6em 5%;
		  }
		  
		  .cd-schedule .event-modal .body {
			position: relative;
			width: 100%;
			/* 70px is the .header height */
			height: calc(100% - 70px);
		  }
		  
		  .cd-schedule .event-modal .event-info {
			position: relative;
			z-index: 2;
			line-height: 1.4;
			height: 100%;
			overflow: hidden;
		  }
		  
		  .cd-schedule .event-modal .event-info > div {
			overflow: auto;
			height: 100%;
			padding: 1.4em 5%;
		  }
		  
		  .cd-schedule .event-modal .header-bg, .cd-schedule .event-modal .body-bg {
			/* these are the morphing backgrounds - visible on desktop only */
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
		  }
		  
		  .cd-schedule .event-modal .body-bg {
			z-index: 1;
			background: white;
			-webkit-transform-origin: top left;
				-ms-transform-origin: top left;
					transform-origin: top left;
		  }
		  
		  .cd-schedule .event-modal .header-bg {
			z-index: 2;
			-webkit-transform-origin: top center;
				-ms-transform-origin: top center;
					transform-origin: top center;
		  }
		  
		  .cd-schedule .event-modal .close {
			/* this is the 'X' icon */
			position: absolute;
			top: 0;
			right: 0;
			z-index: 3;
			background: rgba(0, 0, 0, 0.1);
			/* replace text with icon */
			color: transparent;
			white-space: nowrap;
			text-indent: 100%;
			height: 70px;
			width: 70px;
		  }
		  
		  .cd-schedule .event-modal .close::before, .cd-schedule .event-modal .close::after {
			/* these are the two lines of the 'X' icon */
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: 2px;
			height: 22px;
			background: white;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
		  }
		  
		  .cd-schedule .event-modal .close::before {
			-webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);
				-ms-transform: translateX(-50%) translateY(-50%) rotate(45deg);
					transform: translateX(-50%) translateY(-50%) rotate(45deg);
		  }
		  
		  .cd-schedule .event-modal .close::after {
			-webkit-transform: translateX(-50%) translateY(-50%) rotate(-45deg);
				-ms-transform: translateX(-50%) translateY(-50%) rotate(-45deg);
					transform: translateX(-50%) translateY(-50%) rotate(-45deg);
		  }
		  
		  .cd-schedule .event-modal .event-date {
			display: none;
		  }
		  
		  .cd-schedule .event-modal.no-transition {
			-webkit-transition: none;
			transition: none;
		  }
		  
		  .cd-schedule .event-modal.no-transition .header-bg, .cd-schedule .event-modal.no-transition .body-bg {
			-webkit-transition: none;
			transition: none;
		  }
		  
		  @media only screen and (max-width: 580px) {
			.cd-schedule .event-modal {
			  /* reset style */
			  right: auto;
			  width: auto;
			  height: auto;
			  -webkit-transform: translateX(0);
				  -ms-transform: translateX(0);
					  transform: translateX(0);
			  will-change: transform, width, height;
			  -webkit-transition: height .4s, width .4s, visibility .4s, -webkit-transform .4s;
			  transition: height .4s, width .4s, visibility .4s, -webkit-transform .4s;
			  transition: height .4s, width .4s, transform .4s, visibility .4s;
			  transition: height .4s, width .4s, transform .4s, visibility .4s, -webkit-transform .4s;
			  -webkit-transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
					  transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
			}
			.cd-schedule .event-modal .header {
			  position: absolute;
			  display: block;
			  top: 0;
			  left: 0;
			  height: 100%;
			}
			.cd-schedule .event-modal .header .content {
			  /* reset style */
			  display: block;
			  padding: .8em;
			}
			.cd-schedule .event-modal .event-info > div {
			  padding: 2em 3em 2em 2em;
			}
			.cd-schedule .event-modal .body {
			  height: 100%;
			  width: auto;
			}
			.cd-schedule .event-modal .header-bg, .cd-schedule .event-modal .body-bg {
			  /* Force Hardware acceleration */
			  -webkit-transform: translateZ(0);
					  transform: translateZ(0);
			  will-change: transform;
			  -webkit-backface-visibility: hidden;
					  backface-visibility: hidden;
			}
			.cd-schedule .event-modal .header-bg {
			  -webkit-transition: -webkit-transform .4s;
			  transition: -webkit-transform .4s;
			  transition: transform .4s;
			  transition: transform .4s, -webkit-transform .4s;
			  -webkit-transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
					  transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
			}
			.cd-schedule .event-modal .body-bg {
			  opacity: 0;
			  -webkit-transform: none;
				  -ms-transform: none;
					  transform: none;
			}
			.cd-schedule .event-modal .event-date {
			  display: block;
			}
			.cd-schedule .event-modal .close, .cd-schedule .event-modal .event-info {
			  opacity: 0;
			}
			.cd-schedule .event-modal .close {
			  width: 40px;
			  height: 40px;
			  background: transparent;
			}
			.cd-schedule .event-modal .close::after, .cd-schedule .event-modal .close::before {
			  background: #222222;
			  height: 16px;
			}
		  }
		  
		  @media only screen and (max-width: 500px) {
			.cd-schedule .event-modal .header .content {
			  padding: 1.2em;
			}
		  }
		  
		  .cd-schedule.modal-is-open .event-modal {
			/* .modal-is-open class is added as soon as an event is selected */
			-webkit-transform: translateX(0);
				-ms-transform: translateX(0);
					transform: translateX(0);
			visibility: visible;
		  }
		  
		  .cd-schedule.modal-is-open .event-modal .event-info > div {
			/* smooth scroll on iOS touch devices */
			-webkit-overflow-scrolling: touch;
		  }
		  
		  @media only screen and (max-width: 580px) {
			.cd-schedule.animation-completed .event-modal .close,
			.cd-schedule.content-loaded.animation-completed .event-modal .event-info {
			  /* 	the .animation-completed class is added when the modal animation is completed
					  the .content-loaded class is added when the modal content has been loaded (using ajax) */
			  opacity: 1;
			  -webkit-transition: opacity .2s;
			  transition: opacity .2s;
			}
			.cd-schedule.modal-is-open .body-bg {
			  opacity: 1;
			  -webkit-transition: -webkit-transform .4s;
			  transition: -webkit-transform .4s;
			  transition: transform .4s;
			  transition: transform .4s, -webkit-transform .4s;
			  -webkit-transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
					  transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
			}
		  }
		  
		  .cd-schedule .cover-layer {
			/* layer between the content and the modal window */
			position: fixed;
			z-index: 2;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background: rgba(0, 0, 0, 0.8);
			opacity: 0;
			visibility: hidden;
			-webkit-transition: opacity .4s, visibility .4s;
			transition: opacity .4s, visibility .4s;
		  }
		  
		  .cd-schedule.modal-is-open .cover-layer {
			opacity: 1;
			visibility: visible;
		  }

		  @media(max-width:500px){
			.wrap>li:nth-child(3){
				width:12% !important;
				border:none !important;
			}

			.wrap>li:nth-child(3) .top-info{
				opacity:0;
			}

			.wrap>li:nth-child(3)>ul>li>a{
				display: inline !important;
				padding: 0 !important;
			}

			.wrap>li:nth-child(3) ion-button{
				/*transform:translateY(-94px);*/
				transform:translate(-18px,-52px)
			}

			.wrap>li:nth-child(3) .event-date{
				display:none;
			}

			.timeline>ul{
				width:100% !important;
			}

			[data-order="2"]{
				color:#fff !important;
			}
		  }
		</style>`

		div!.innerHTML = html;
		this.RunSchedulePlan()
		this.dismissLoading()
	  })
  }

  addDataReport(time:number){

	  let validation:boolean=true
	  let dataFilter:any
	  for(let hora of this.listaHorasActivas){
		  if(parseInt(hora.inicio)<=time && time<=parseInt(hora.fin)){
			validation=false
			dataFilter=hora
		  }else{
			dataFilter=hora
		  }
		  
	  }
	  
	  if(validation){
		  //abrir toma de tiempo para agregar en hora no definida
		  let horaInicio:string=(String(time).length<=3)?"0"+String(time).substr(0,1)+":"+String(time).substr(1,2):+String(time).substr(0,2)+":"+String(time).substr(2,2)
		  let params=`;idTarea=${dataFilter.tarea};machine=${dataFilter.maquina};machineIdInterno=${dataFilter.maquinainterna};fecha=${dataFilter.fecha};horaInicio=${horaInicio};uid=${dataFilter.uid}`
		  this.router.navigateByUrl(`/toma-tiempo${params}`,  {replaceUrl:true})
	  }
  }

  openFotos(idTareaEvent: any){
	console.log('entra al route')
    this.router.navigate(['/tomar-foto',  { idTarea: idTareaEvent,retorn:"reporte-diario" }])
  }

  changedReport() {
	this.ShowLoading()
	const maquina = document.getElementById('cmbTarea');
	const idMachine = (maquina as HTMLIonSelectElement).value;
	console.log("idmachine", idMachine)
	this.idMachine = idMachine;

	const dtime:any = document.getElementById('datetime');
	const fecha = new Date(dtime.value);
	fecha.setHours(0);
	fecha.setMinutes(0);
	fecha.setSeconds(0);
	fecha.setMilliseconds(0);

	let fechaSend:any=fecha.toLocaleDateString().split("/")
	let anio:string=fechaSend[2]
	let mes:string=(fechaSend[1].length==1)?"0"+fechaSend[1]:fechaSend[1]
	let dia:string=(fechaSend[0].length==1)?"0"+fechaSend[0]:fechaSend[0]
	fechaSend=anio+"-"+mes+"-"+dia

	

	this.generarHtml(fechaSend, this.idMachine);
	
  }

   ngAfterViewInit(): void {

	let idTask = this.route.snapshot.paramMap.get("idTarea");
	let idMachine = this.route.snapshot.paramMap.get("machine");
	let fechaR = this.route.snapshot.paramMap.get("fecha");
	if(!idTask){
		idTask = ''
  	}

	
	if(idMachine){
		this.idMachine = idMachine;
		this.cmbMaquina=idMachine
		this.ShowLoading()
		this.generarHtml(fechaR, this.idMachine);
		this.fechaSeleccionada=fechaR
  	}


	const date = new Date().toLocaleDateString();
	const fec = date.split('/');
	const anio = fec[2];
	const mes = fec[1].padStart(2, '0');
	const dia = fec[0].padStart(2, '0');

	const fecha = anio+'-'+mes+'-'+dia

	//await this.generarHtml(fecha, this.idMachine);
	
  }

  atras(){
	this.router.navigateByUrl('/inicio');
  }
  //#region "jQuery"
  RunSchedulePlan(){
	var self=this
    this.transitionsSupported=( $('.csstransitions').length > 0 );
    var schedules:any = $('.cd-schedule');
    var objSchedulesPlan:any = [];
    
    if( schedules.length > 0 ) {
      schedules.each(function(this){
        //create SchedulePlan objects
        console.log("RunSchedulePlan",this)
        //objSchedulesPlan.push(self.SchedulePlan($(this)));
        self.SchedulePlan(this)
      });
    }
  }

  SchedulePlan( element:any ) {
		this.element = $(element);
		this.timeline = this.element.find('.timeline');
		this.timelineItems = this.timeline.find('li');
		this.timelineItemsNumber = this.timelineItems.length;
		this.timelineStart = this.getScheduleTimestamp(this.timelineItems.eq(0).text());
		//need to store delta (in our case half hour) timestamp
		this.timelineUnitDuration = this.getScheduleTimestamp(this.timelineItems.eq(1).text()) - this.getScheduleTimestamp(this.timelineItems.eq(0).text());

		this.eventsWrapper = this.element.find('.events');
		this.eventsGroup = this.eventsWrapper.find('.events-group');
		this.singleEvents = this.eventsGroup.find('.single-event');
		this.eventSlotHeight = this.eventsGroup.eq(0).children('.top-info').outerHeight();

		this.modal = this.element.find('.event-modal');
		this.modalHeader = this.modal.find('.header');
		this.modalHeaderBg = this.modal.find('.header-bg');
		this.modalBody = this.modal.find('.body'); 
		this.modalBodyBg = this.modal.find('.body-bg'); 
		this.modalMaxWidth = 800;
		this.modalMaxHeight = 480;

		this.animating = false;

		this.initSchedule();
  }
  
  initSchedule = () =>{
		this.scheduleReset();
		this.initEvents();
  };
  
  scheduleReset = ()=> {
	var mq = this.mq();
	if( mq == 'desktop' && !this.element.hasClass('js-full') ) {
		//in this case you are on a desktop version (first load or resize from mobile)
		this.eventSlotHeight = this.eventsGroup.eq(0).children('.top-info').outerHeight();
		//this.element.addClass('js-full');
		this.placeEvents();
		this.element.hasClass('modal-is-open') && this.checkEventModal();
	} else if(  mq == 'mobile' && this.element.hasClass('js-full') ) {
		//in this case you are on a mobile version (first load or resize from desktop)
		//this.element.removeClass('js-full loading');
		this.eventsGroup.children('ul').add(this.singleEvents).removeAttr('style');
		this.eventsWrapper.children('.grid-line').remove();
		this.element.hasClass('modal-is-open') && this.checkEventModal();
	} else if( mq == 'desktop' && this.element.hasClass('modal-is-open')){
		//on a mobile version with modal open - need to resize/move modal window
  //this.checkEventModal('desktop');
  this.checkEventModal();
		//this.element.removeClass('loading');
	} else {
		//this.element.removeClass('loading');
	}
  };
  
  initEvents = () =>{
		var self = this;

		this.singleEvents.each(function(this){
			
			//create the .event-date element for each event
			var durationLabel = '<span class="event-date">'+$(this).data('start')+' - '+$(this).data('end')+'</span>';
			if($(this)[0].dataset.event!="event-1" && $(this)[0].dataset.event!="event-3" && $(this)[0].dataset.event!="event-4"){
				$(this).children('a').prepend($(durationLabel));
			}

			//detect click on the event and open the modal
			$(this).on('click', 'a', function(event){
				event.preventDefault();
				if( !self.animating ) self.openModal($(this));
			});
		});

		//close modal window
		this.modal.on('click', '.close', function(event){
			event.preventDefault();
			if( !self.animating ) self.closeModal(self.eventsGroup.find('.selected-event'));
		});
		this.element.on('click', '.cover-layer', function(event){
			if( !self.animating && self.element.hasClass('modal-is-open') ) self.closeModal(self.eventsGroup.find('.selected-event'));
		});
  };
  
  placeEvents = ()=> {
		var self = this;
		this.singleEvents.each(function(this){
			//place each event in the grid -> need to set top position and height
			var start = self.getScheduleTimestamp($(this).attr('data-start')),
				duration = self.getScheduleTimestamp($(this).attr('data-end')) - start;

			var eventTop = self.eventSlotHeight*(start - self.timelineStart)/self.timelineUnitDuration,
				eventHeight = self.eventSlotHeight*duration/self.timelineUnitDuration;
			
			$(this).css({
				top: (eventTop +12) +'px',
				height: (eventHeight-3)+'px'
			});
		});

		this.element.removeClass('loading');
  };
  
  async presentAlertConfirm(params:any="",paramsDel:any="") {
    const alert = await this.alertController.create({
      header: 'Notificación',
      message: '¿Que desea hacer con la actividad?',
      buttons: [
        {
          text: 'Eliminar',
          cssClass: 'secondary',
          handler: (blah) => {
			this.eliminarTaskEvent(paramsDel)
          }
        }, {
          text: 'Actualizar',
          handler: () => {
			this.router.navigateByUrl(`/toma-tiempo${params}`,  {replaceUrl:true})
          }
        }
      ]
    });

    await alert.present();
  } 

  eliminarTaskEvent(params){
	this.ShowLoading()
	this.taskService.deteleTaskEvent(params).subscribe((data:any)=>{
		if(data.ok){
			this.dismissLoading()
			this.generarHtml(this.fechaSeleccionada, this.idMachine);
		}else{
			this.dismissLoading()
		}
	})
  }

  openModal = (event:any)=> {
		
		let idTareaEvent=event[0].dataset.uid

		if(event[0].dataset.order==1){
			this.router.navigate(['/map', { idTarea: idTareaEvent }]);
		}

		if(event[0].dataset.order==2){
			
			let params=`;idTarea=${event[0].dataset.tarea};machine=${event[0].dataset.maquina};machineIdInterno=${event[0].dataset.maquinainterna};tipo=${event[0].dataset.tipo};subtipo=${event[0].dataset.subtipo};fecha=${this.fechaSeleccionada};uid=${idTareaEvent}`
			let paramsDel:any={
				uid:event[0].dataset.uid
			}
			this.presentAlertConfirm(params,paramsDel)
			/*this.router.navigate(['/toma-tiempo',  {
				idTarea: event[0].dataset.tarea ,
				machine: event[0].dataset.maquina,
				machineIdInterno:event[0].dataset.maquinainterna,
				tipo:event[0].dataset.tipo,
				subtipo:event[0].dataset.subtipo,
				fecha:this.fechaSeleccionada,
				uid:idTareaEvent
			}])*/
		}

		if(event[0].dataset.order==3){
			this.router.navigate(['/tomar-foto',  { idTarea: idTareaEvent, retorno: "reporte-diario", idUser: this.idUser }])
		}
		
		// var self = this;
		// var mq = self.mq();
		// this.animating = true;

		// //update event name and time
		// this.modalHeader.find('.event-name').text(event.find('.event-name').text());
		// this.modalHeader.find('.event-date').text(event.find('.event-date').text());
		// this.modal.attr('data-event', event.parent().attr('data-event'));

		// //update event content
		// this.modalBody.find('.event-info').load(event.parent().attr('data-content')+'.html .event-info > *', function(data){
		// 	//once the event content has been loaded
		// 	self.element.addClass('content-loaded');
		// });

		// this.element.addClass('modal-is-open');

		// setTimeout(function(){
		// 	//fixes a flash when an event is selected - desktop version only
		// 	event.parent('li').addClass('selected-event');
		// }, 10);

		// if( mq == 'mobile' ) {
		// 	self.modal.one(this.transitionEnd, function(this){
		// 		self.modal.off(this.transitionEnd);
		// 		self.animating = false;
		// 	});
		// } else {
		// 	var eventTop:any = event.offset().top - (this.window).scrollTop(),
		// 		eventLeft:any = event.offset().left,
		// 		eventHeight:any = event.innerHeight(),
		// 		eventWidth:any = event.innerWidth();

		// 	var windowWidth:number = this.window.innerWidth,//$(window).width(),
		// 		windowHeight:number = this.window.innerHeight//$(window).height();

		// 	var modalWidth:number = ( windowWidth*.8 > self.modalMaxWidth ) ? self.modalMaxWidth : windowWidth*.8,
		// 		modalHeight:number = ( windowHeight*.8 > self.modalMaxHeight ) ? self.modalMaxHeight : windowHeight*.8;
        
		// 	var modalTranslateX:any = (windowWidth - modalWidth)/2 - eventLeft,
		// 		modalTranslateY:any = (windowHeight - modalHeight)/2 - eventTop; //parseInt
			
		// 	var HeaderBgScaleY = modalHeight/eventHeight,
		// 		BodyBgScaleX = (modalWidth - eventWidth);

		// 	//change modal height/width and translate it
		// 	self.modal.css({
		// 		top: eventTop+'px',
		// 		left: eventLeft+'px',
		// 		height: modalHeight+'px',
		// 		width: modalWidth+'px',
		// 	});
		// 	self.transformElement(self.modal, 'translateY('+modalTranslateY+'px) translateX('+modalTranslateX+'px)');

		// 	//set modalHeader width
		// 	self.modalHeader.css({
		// 		width: eventWidth+'px',
		// 	});
		// 	//set modalBody left margin
		// 	self.modalBody.css({
		// 		marginLeft: eventWidth+'px',
		// 	});

		// 	//change modalBodyBg height/width ans scale it
		// 	self.modalBodyBg.css({
		// 		height: eventHeight+'px',
		// 		width: '1px',
		// 	});
		// 	self.transformElement(self.modalBodyBg, 'scaleY('+HeaderBgScaleY+') scaleX('+BodyBgScaleX+')');

		// 	//change modal modalHeaderBg height/width and scale it
		// 	self.modalHeaderBg.css({
		// 		height: eventHeight+'px',
		// 		width: eventWidth+'px',
		// 	});
		// 	self.transformElement(self.modalHeaderBg, 'scaleY('+HeaderBgScaleY+')');
			
		// 	self.modalHeaderBg.one(this.transitionEnd, function(){
		// 		//wait for the  end of the modalHeaderBg transformation and show the modal content
		// 		self.modalHeaderBg.off(self.transitionEnd);
		// 		self.animating = false;
		// 		self.element.addClass('animation-completed');
		// 	});
		// }

		// //if browser do not support transitions -> no need to wait for the end of it
		// if( !this.transitionsSupported ) self.modal.add(self.modalHeaderBg).trigger(this.transitionEnd);
  };
  
  closeModal = (event) =>{
		var self = this;
		var mq = self.mq();

		this.animating = true;

		if( mq == 'mobile' ) {
			this.element.removeClass('modal-is-open');
			this.modal.one(this.transitionEnd, function(){
				self.modal.off(self.transitionEnd);
				self.animating = false;
				self.element.removeClass('content-loaded');
				event.removeClass('selected-event');
			});
		} else {
			var eventTop = event.offset().top -this.window.scrollY,//$(this.window).scrollTop(),
				eventLeft = event.offset().left,
				eventHeight = event.innerHeight(),
				eventWidth = event.innerWidth();

			var modalTop = Number(self.modal.css('top').replace('px', '')),
				modalLeft = Number(self.modal.css('left').replace('px', ''));

			var modalTranslateX = eventLeft - modalLeft,
				modalTranslateY = eventTop - modalTop;

			self.element.removeClass('animation-completed modal-is-open');

			//change modal width/height and translate it
			this.modal.css({
				width: eventWidth+'px',
				height: eventHeight+'px'
			});
			self.transformElement(self.modal, 'translateX('+modalTranslateX+'px) translateY('+modalTranslateY+'px)');
			
			//scale down modalBodyBg element
			self.transformElement(self.modalBodyBg, 'scaleX(0) scaleY(1)');
			//scale down modalHeaderBg element
			self.transformElement(self.modalHeaderBg, 'scaleY(1)');

			this.modalHeaderBg.one(this.transitionEnd, function(){
				//wait for the  end of the modalHeaderBg transformation and reset modal style
				self.modalHeaderBg.off(self.transitionEnd);
				self.modal.addClass('no-transition');
				setTimeout(function(){
					self.modal.add(self.modalHeader).add(self.modalBody).add(self.modalHeaderBg).add(self.modalBodyBg).attr('style', '');
				}, 10);
				setTimeout(function(){
					self.modal.removeClass('no-transition');
				}, 20);

				self.animating = false;
				self.element.removeClass('content-loaded');
				event.removeClass('selected-event');
			});
		}

		//browser do not support transitions -> no need to wait for the end of it
		if( !this.transitionsSupported ) self.modal.add(self.modalHeaderBg).trigger(this.transitionEnd);
  }
  
  mq = ()=>{
		//get MQ value ('desktop' or 'mobile') 
		var self = this;
		console.log("mq")
		return this.window.getComputedStyle(this.element.get(0), '::before').getPropertyValue('content').replace(/["']/g, '');
  };
  
  checkEventModal = ()=> {
		this.animating = true;
		var self = this;
		var mq = this.mq();

		if( mq == 'mobile' ) {
			//reset modal style on mobile
			self.modal.add(self.modalHeader).add(self.modalHeaderBg).add(self.modalBody).add(self.modalBodyBg).attr('style', '');
			self.modal.removeClass('no-transition');	
			self.animating = false;	
		} else if( mq == 'desktop' && self.element.hasClass('modal-is-open') ) {
			self.modal.addClass('no-transition');
			self.element.addClass('animation-completed');
			var event = self.eventsGroup.find('.selected-event');

			var eventTop = event.offset().top - this.window.scrollY,//$(window).scrollTop(),
				eventLeft = event.offset().left,
				eventHeight = event.innerHeight(),
				eventWidth = event.innerWidth();

			var windowWidth:number = this.window.innerWidth,// $(window).width(),
				windowHeight:number = this.window.innerHeight// $(window).height();

			var modalWidth = ( windowWidth*.8 > self.modalMaxWidth ) ? self.modalMaxWidth : windowWidth*.8,
				modalHeight = ( windowHeight*.8 > self.modalMaxHeight ) ? self.modalMaxHeight : windowHeight*.8;

			var HeaderBgScaleY = modalHeight/eventHeight,
				BodyBgScaleX = (modalWidth - eventWidth);

			setTimeout(function(){
				self.modal.css({
					width: modalWidth+'px',
					height: modalHeight+'px',
					top: (windowHeight/2 - modalHeight/2)+'px',
					left: (windowWidth/2 - modalWidth/2)+'px',
				});
				self.transformElement(self.modal, 'translateY(0) translateX(0)');
				//change modal modalBodyBg height/width
				self.modalBodyBg.css({
					height: modalHeight+'px',
					width: '1px',
				});
				self.transformElement(self.modalBodyBg, 'scaleX('+BodyBgScaleX+')');
				//set modalHeader width
				self.modalHeader.css({
					width: eventWidth+'px',
				});
				//set modalBody left margin
				self.modalBody.css({
					marginLeft: eventWidth+'px',
				});
				//change modal modalHeaderBg height/width and scale it
				self.modalHeaderBg.css({
					height: eventHeight+'px',
					width: eventWidth+'px',
				});
				self.transformElement(self.modalHeaderBg, 'scaleY('+HeaderBgScaleY+')');
			}, 10);

			setTimeout(function(){
				self.modal.removeClass('no-transition');
				self.animating = false;	
			}, 20);
		}
	};

   checkResize(){
		this.objSchedulesPlan.forEach(function(element:any){
			element.scheduleReset();
		});
		this.windowResize = false;
	}

	 getScheduleTimestamp(time:any) {
		//accepts hh:mm format - convert hh:mm to timestamp
		time = time.replace(/ /g,'');
		var timeArray = time.split(':');
		var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
		return timeStamp;
	}

	 transformElement(element:any, value:any) {
		element.css({
		    '-moz-transform': value,
		    '-webkit-transform': value,
			'-ms-transform': value,
			'-o-transform': value,
			'transform': value
		});
	}
//#endregion

}
