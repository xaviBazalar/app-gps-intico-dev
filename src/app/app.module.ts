import { isDevMode, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
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
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { InfouserComponent } from './components/infouser/infouser.component';
import { appReducers } from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EffectsArray } from './store/effects/index';

import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
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
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(EffectsArray),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })

  ],
  providers: [Camera,
    Geolocation,
    FileTransfer,
    BackgroundMode,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }],
  bootstrap: [AppComponent],
})
export class AppModule { }
