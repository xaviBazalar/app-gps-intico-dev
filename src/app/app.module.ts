import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';

import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage-angular';

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            ComponentsModule,
            HttpClientModule,
            TranslateModule.forRoot(
              {
                loader:{
                  provide:TranslateLoader,
                  useFactory:HttpLoaderFactory,
                  deps:[HttpClient]
                }
              }
            ),
            IonicStorageModule.forRoot()
          ],
  providers: [Camera,
              Geolocation,
              FileTransfer,
              { provide: RouteReuseStrategy,
                useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
