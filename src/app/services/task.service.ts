import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskEventsModel } from '../models/taskEvents'

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl:string = environment.url;

  constructor(private http: HttpClient) { }

  getTask(user:String|null,machine:String|null,fecha:String|null) {
    return this.http.get(`${this.baseUrl}/task?machine=${ machine }&fecha=${ fecha }&idUser=${ user }`)
  }

  async guardarTaskEvent(task: TaskEventsModel) {
    console.log(task);

    return this.http.post(`${ this.baseUrl }/task/event`, task)
        
  }

  async actualizarTaskEvent(task: TaskEventsModel) {
    console.log(task);

    return this.http.put(`${ this.baseUrl }/task/event`, task)
        
  }  

  async getTaskEvent(idTask: String){
    return this.http.get(`${ this.baseUrl }/task/event?task=${ idTask }`)
  }

}
