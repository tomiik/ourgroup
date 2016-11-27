import { Component } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedIn: boolean = false;
  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.bsLoggedIn.subscribe((status) => this.loggedIn = status);
  }

}
