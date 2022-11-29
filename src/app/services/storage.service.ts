import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { UserModel } from '../models/user'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _localUser: UserModel = new UserModel;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async saveRemoveUsuario( user: UserModel ) {
    this._storage?.set( 'user', user );
  }

  async getUsuario(){
    try{
      await this._storage?.get('user').then((usuario: any) => {
        // console.log('userStorage', usuario[0]);
        this._localUser = usuario[0];
      });
      
    }catch(error){
      console.log(error);
    }

    return this._localUser;
  }
}