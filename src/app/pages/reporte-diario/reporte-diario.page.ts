import { Component, Inject, OnInit } from '@angular/core';
import * as $ from 'jquery'
import * as jQuery from 'jquery';
import { DOCUMENT } from '@angular/common';
import { TaskEventsModel } from '../../models/taskEvents'
import { TaskService } from 'src/app/services/task.service';
import { ActivatedRoute, Route, Router } from '@angular/router';


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

	listaEventos: Array<TaskEventsModel> = []

  constructor(@Inject(DOCUMENT) private document: Document, private taskService: TaskService, private route: ActivatedRoute) { 
    this.window = this.document.defaultView;
    this.date = new Date().toString();
    //this.transitionsSupported=( $('.csstransitions').length > 0 );
    if( !this.transitionsSupported ) this.transitionEnd = 'noTransition';
  }

  async ngOnInit(): Promise<void> {
	/*
		<ul class="wrap">
        <li class="events-group">
          <div class="top-info"><span>gps</span></div>
          <ul>            
            <li class="single-event" data-start="08:15" data-end="10:30" data-content="event-abs-circuit" data-event="event-5">
              <ion-card>
                <ion-card-content>
                  <ion-label>GPS</ion-label><br>
                  <ion-label>Uso:</ion-label><br>
                  <ion-label>Distancia:</ion-label><br>
                  <ion-label>Velocidad:</ion-label><br>
                </ion-card-content>
              </ion-card>
            </li>  
            <li class="single-event" data-start="11:00" data-end="12:30" data-content="event-rowing-workout" data-event="event-5">              
            </li>  
            <li class="single-event" data-start="14:00" data-end="15:15"  data-content="event-yoga-1" data-event="event-5">              
            </li>
          </ul>
        </li>
        <li class="events-group">
          <div class="top-info"><span>Eventos</span></div>
          <ul>            
            <li class="single-event" data-start="08:15" data-end="10:30" data-content="event-abs-circuit" data-event="event-1">
              <!-- <a href="#0">
                <em class="event-name">Abs Circuit</em>
              </a> -->
            </li>
            <li class="single-event" data-start="11:00" data-end="12:30" data-content="event-rowing-workout" data-event="event-4">
              <!-- <a href="#0">
                <em class="event-name">Rowing Workout</em>
              </a> -->
            </li>
            <li class="single-event" data-start="14:00" data-end="15:15"  data-content="event-yoga-1" data-event="event-3">
              <!-- <a href="#0">
                <em class="event-name">Yoga Level 1</em>
              </a> -->
            </li>
          </ul>
        </li>
        <li class="events-group">
          <div class="top-info"><span>Evidencias</span></div>
          <ul>            
            <li class="single-event" data-start="10:30" data-end="10:30" data-content="event-abs-circuit" data-event="event-3">
              <!-- <a href="#0">
                <em class="event-name">Abs Circuit</em>
              </a> -->
            </li>  
            <li class="single-event" data-start="12:30" data-end="12:30" data-content="event-rowing-workout" data-event="event-3">
              <!-- <a href="#0">
                <em class="event-name">Rowing Workout</em>
              </a> -->
            </li>  
            <li class="single-event" data-start="15:15" data-end="15:15"  data-content="event-yoga-1" data-event="event-3">
              <!-- <a href="#0">
                <em class="event-name">Yoga Level 1</em>
              </a> -->
            </li>
          </ul>
        </li>
      </ul>
	*/

	let idTask = this.route.snapshot.paramMap.get("idTarea");
	if(!idTask){
		idTask = ''
  	}
	
	let html: string = '<ul class="wrap">';

	(await this.taskService.getTaskEvent(idTask)).subscribe((data: any) => {
		  const { taskEvent } = data;
		  html += '<li class="events-group"><div class="top-info"><span>Eventos</span></div><ul>';

		  //para los eventos
		  for (let i = 0; i < taskEvent.length; i++) {
			  html += `<li class="single-event" data-start="${taskEvent[i].horaInicio}" data-end="${taskEvent.horaFin}" data-content="event-abs-circuit" data-event="event-1">`;
			  // <!-- <a href="#0">
			  //   <em class="event-name">Abs Circuit</em>
			  // </a> -->
			  html += '</li>';
		  }

		  html += '</ul></li>'
	  })

	const div = document.getElementById('divEventos');
	div!.innerHTML = html;

	console.log(html)

  }



  ngAfterViewInit(): void {
    var self=this
    this.transitionsSupported=( $('.csstransitions').length > 0 );
    var schedules:any = $('.cd-schedule');
    console.log(schedules)
    var objSchedulesPlan:any = [];
    
    if( schedules.length > 0 ) {
      schedules.each(function(this){
        //create SchedulePlan objects
        console.log(this)
        //objSchedulesPlan.push(this.SchedulePlan($(this)));
        self.SchedulePlan(this)
      });
    }
  }


  //#region "jQuery"
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
			this.element.addClass('js-full');
			this.placeEvents();
			this.element.hasClass('modal-is-open') && this.checkEventModal();
		} else if(  mq == 'mobile' && this.element.hasClass('js-full') ) {
			//in this case you are on a mobile version (first load or resize from desktop)
			this.element.removeClass('js-full loading');
			this.eventsGroup.children('ul').add(this.singleEvents).removeAttr('style');
			this.eventsWrapper.children('.grid-line').remove();
			this.element.hasClass('modal-is-open') && this.checkEventModal();
		} else if( mq == 'desktop' && this.element.hasClass('modal-is-open')){
			//on a mobile version with modal open - need to resize/move modal window
      //this.checkEventModal('desktop');
      this.checkEventModal();
			this.element.removeClass('loading');
		} else {
			this.element.removeClass('loading');
		}
  };
  
  initEvents = () =>{
		var self = this;

		this.singleEvents.each(function(this){
			//create the .event-date element for each event
			var durationLabel = '<span class="event-date">'+$(this).data('start')+' - '+$(this).data('end')+'</span>';
			$(this).children('a').prepend($(durationLabel));

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
				top: (eventTop -1) +'px',
				height: (eventHeight+1)+'px'
			});
		});

		this.element.removeClass('loading');
  };
  
  openModal = (event:any)=> {
		var self = this;
		var mq = self.mq();
		this.animating = true;

		//update event name and time
		this.modalHeader.find('.event-name').text(event.find('.event-name').text());
		this.modalHeader.find('.event-date').text(event.find('.event-date').text());
		this.modal.attr('data-event', event.parent().attr('data-event'));

		//update event content
		this.modalBody.find('.event-info').load(event.parent().attr('data-content')+'.html .event-info > *', function(data){
			//once the event content has been loaded
			self.element.addClass('content-loaded');
		});

		this.element.addClass('modal-is-open');

		setTimeout(function(){
			//fixes a flash when an event is selected - desktop version only
			event.parent('li').addClass('selected-event');
		}, 10);

		if( mq == 'mobile' ) {
			self.modal.one(this.transitionEnd, function(this){
				self.modal.off(this.transitionEnd);
				self.animating = false;
			});
		} else {
			var eventTop:any = event.offset().top - (this.window).scrollTop(),
				eventLeft:any = event.offset().left,
				eventHeight:any = event.innerHeight(),
				eventWidth:any = event.innerWidth();

			var windowWidth:number = this.window.innerWidth,//$(window).width(),
				windowHeight:number = this.window.innerHeight//$(window).height();

			var modalWidth:number = ( windowWidth*.8 > self.modalMaxWidth ) ? self.modalMaxWidth : windowWidth*.8,
				modalHeight:number = ( windowHeight*.8 > self.modalMaxHeight ) ? self.modalMaxHeight : windowHeight*.8;
        
			var modalTranslateX:any = (windowWidth - modalWidth)/2 - eventLeft,
				modalTranslateY:any = (windowHeight - modalHeight)/2 - eventTop; //parseInt
			
			var HeaderBgScaleY = modalHeight/eventHeight,
				BodyBgScaleX = (modalWidth - eventWidth);

			//change modal height/width and translate it
			self.modal.css({
				top: eventTop+'px',
				left: eventLeft+'px',
				height: modalHeight+'px',
				width: modalWidth+'px',
			});
			self.transformElement(self.modal, 'translateY('+modalTranslateY+'px) translateX('+modalTranslateX+'px)');

			//set modalHeader width
			self.modalHeader.css({
				width: eventWidth+'px',
			});
			//set modalBody left margin
			self.modalBody.css({
				marginLeft: eventWidth+'px',
			});

			//change modalBodyBg height/width ans scale it
			self.modalBodyBg.css({
				height: eventHeight+'px',
				width: '1px',
			});
			self.transformElement(self.modalBodyBg, 'scaleY('+HeaderBgScaleY+') scaleX('+BodyBgScaleX+')');

			//change modal modalHeaderBg height/width and scale it
			self.modalHeaderBg.css({
				height: eventHeight+'px',
				width: eventWidth+'px',
			});
			self.transformElement(self.modalHeaderBg, 'scaleY('+HeaderBgScaleY+')');
			
			self.modalHeaderBg.one(this.transitionEnd, function(){
				//wait for the  end of the modalHeaderBg transformation and show the modal content
				self.modalHeaderBg.off(self.transitionEnd);
				self.animating = false;
				self.element.addClass('animation-completed');
			});
		}

		//if browser do not support transitions -> no need to wait for the end of it
		if( !this.transitionsSupported ) self.modal.add(self.modalHeaderBg).trigger(this.transitionEnd);
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
		return window.getComputedStyle(this.element.get(0), '::before').getPropertyValue('content').replace(/["']/g, '');
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
