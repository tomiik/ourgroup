import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseService } from '../firebase.service';
declare var $ : any;
const log: boolean = false;

@Component({
  selector: 'us-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myName: string = '';
  newName: string = '';
  email: string = 'a@a.aaa';
  password: string = 'aaaaaa';
  loggedIn: boolean = false;
  peerListLoaded: boolean = false;
  userLoaded: boolean = false;
  myPositionLoaded: boolean = false;
  constructor(private af: AngularFire, private firebaseService: FirebaseService) {
    // this.af.auth.subscribe(auth => console.log(auth));
    this.firebaseService.bsMyName.subscribe( (myName) => {
      this.myName = myName;
      this.newName = myName;
    });
    this.firebaseService.bsLoggedIn.subscribe((status) => {this.loggedIn = status});

    this.firebaseService.fbMyPeersList.subscribe(() => this.peerListLoaded = true);
    this.firebaseService.fbUsers.subscribe(() => this.userLoaded = true);
    this.firebaseService.fbMyPosition.subscribe(() => this.myPositionLoaded = true);

    $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
      $('.modal').modal();
    });
  }
  ngOnInit() {
  }
  login(email: string, password: string) {
     this.firebaseService.login(email, password);
   }

   logout() {
     this.firebaseService.logout();
   }
   changeName(name) {
     this.firebaseService.changeName(name);
     this.firebaseService.mutter(this.myName + " changed name -> " + name);
   }
   changeNameCancel() {
     this.newName = this.myName;
   }
}
