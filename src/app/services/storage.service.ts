import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

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
  }
    
  get getUser() {
    return [ ...this._localUser ];
  }
  
  async saveRemoveUsuario( user: UserModel ) {
    this._storage?.set('user', user);
  }

  async loadUser(){    
    const user = await this._storage?.get('user');
    //console.log('storageUser', user)
    //this._localUser = user;
    return user
  }
}