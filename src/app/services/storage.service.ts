import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TaskEventsModel } from '../models/taskEvents';

import { UserModel } from '../models/user'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _localUser: UserModel[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;

    this.loadUser();
    this.loadTask();
  }
    
  get getUser() {
    console.log("data localUser",this._localUser)
    return [ ...this._localUser ];
  }
  
  saveRemoveUsuario( user: UserModel ) {
    this._storage?.set('user', user);
  }

  async loadUser(){    
    const user = await this._storage?.get('user');
    //console.log('storageUser', user)
    //this._localUser = user;
    return user
  }

  saveTaskEvent(taskEvent: TaskEventsModel){
    this._storage?.set('task', taskEvent)
  }

  async loadTask(){    
    const task = await this._storage?.get('task');
    return task;
  }

}