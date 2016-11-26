import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'us-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myName: string = '';
  constructor(private af: AngularFire, private firebaseService: FirebaseService) {
    // this.af.auth.subscribe(auth => console.log(auth));
    this.firebaseService.bsMyName.subscribe( (myName) => this.myName = myName);
  }

  ngOnInit() {
  }
  login() {
     this.firebaseService.login("g244103x@gmail.com", "123456");
   }

   logout() {
      this.af.auth.logout();
   }
}
