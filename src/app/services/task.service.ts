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

  getTask(machine:string|null,fecha:string|null) {
    return this.http.get(`${this.baseUrl}/task?machine=${ machine }&fecha=${ fecha }`)
  }

  guardarTaskEvent(task: TaskEventsModel) {
    console.log(task);

    return this.http.post(`${ this.baseUrl }/task/event`, task)
        //   .pipe(
        //     map( (resp: any) => {
        //       heroe.id = resp.name;
        //       return heroe;
        //     })
        //   )
  }

}
