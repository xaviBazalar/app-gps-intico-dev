import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-infouser',
  templateUrl: './infouser.component.html',
  styleUrls: ['./infouser.component.scss'],
})
export class InfouserComponent implements OnInit {
  nombreUsuarioMenu:string=""

  constructor(public storageService: StorageService) { }

  async ngOnInit(): Promise<void> {
    const [user] = await Promise.all([this.storageService.loadUser()]);
    this.nombreUsuarioMenu=user[0].nombre
  }

}
