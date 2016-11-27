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
  email: string ='a@a.aaa';
  password: string ='aaaaaa';
  constructor(private af: AngularFire, private firebaseService: FirebaseService) {
    // this.af.auth.subscribe(auth => console.log(auth));
    this.firebaseService.bsMyName.subscribe( (myName) => this.myName = myName);
  }

  ngOnInit() {
  }
  login(email: string, password: string) {
     this.firebaseService.login(email, password);
   }

   logout() {
      this.af.auth.logout();
   }
}
