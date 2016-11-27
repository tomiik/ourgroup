import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { MapComponent } from './map/map.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { PeerlistComponent } from './peerlist/peerlist.component';
import { FirebaseService } from './firebase.service';
import { LoginComponent } from './login/login.component';
import { TabComponent } from './tab/tab.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyDWL6Tm8w2IziPpVRO0xohPEqwQw8EQhc4',
  authDomain: 'mutter-347a3.firebaseapp.com',
  databaseURL: 'https://mutter-347a3.firebaseio.com',
  storageBucket: 'mutter-347a3.appspot.com',
  messagingSenderId: '194559638524'
};

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ChatboxComponent,
    PeerlistComponent,
    LoginComponent,
    TabComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBCW0s-xHxbIWk8CRfJNpgfvGo8hmT-8a0'
    })
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
