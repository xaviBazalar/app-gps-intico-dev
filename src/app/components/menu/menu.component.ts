import { Component, OnInit } from '@angular/core';
import { OptionService }  from '../../services/option.service';
import { OptionModel } from '../../models/option';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  appPages: any[] = [];

  constructor(
    private optionService: OptionService){
  }


  async ngOnInit(): Promise<void> {
    this.optionService.getOption().subscribe((data: any) => {
      //console.log('menu',data)
      this.appPages = data.option;
    })
  }
}
