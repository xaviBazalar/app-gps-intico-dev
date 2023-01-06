import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskEventsModel } from '../models/taskEvents'
import { TaskModel } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl:string = environment.url;

  constructor(private http: HttpClient) { }

  getTask(user:String|null,machine:String|null,fecha:String|null) {
    return this.http.get(`${this.baseUrl}/task?machine=${ machine }&fecha=${ fecha }&idUser=${ user }`)
  }

  getTaskId(id:String) {
    return this.http.get(`${this.baseUrl}/task/id?id=${ id }`)
  }

  postTask(task: TaskModel) {
    return this.http.post(`${ this.baseUrl }/task`, task);        
  }

  guardarTaskEvent(task: TaskEventsModel) {
    console.log(task);

    return this.http.post(`${ this.baseUrl }/task/event`, task)
        
  }

  actualizarTaskEvent(task: TaskEventsModel) {
    console.log(task);

    return this.http.put(`${ this.baseUrl }/task/event`, task)
        
  }  

  deteleTaskEvent(params: any){
    return this.http.delete(`${ this.baseUrl }/task/event`,{body: params} )
  }

  getTaskEvent(idTask: String){
    console.log('event', idTask)
    return this.http.get(`${ this.baseUrl }/task/event?task=${ idTask }`)
  }

  async getTaskEventMap(idTask: String){
    console.log('event', idTask)
    return this.http.get(`${ this.baseUrl }/task/event?task_event=${ idTask }`)
  }

  getTaskEventReporte(fecha: any, machine: any){
    
    return this.http.get(`${ this.baseUrl }/task/report?fecha=${ fecha }&machine=${ machine }`)
  }
  
}
