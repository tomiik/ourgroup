import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'us-app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  id: number;
  peersPositions;
  timer;
  constructor(private firebaseService: FirebaseService) {
    //this.firebaseService.bsPeersPositions.subscribe((peersPositions) => {
    //  this.refreshPeersPositions( peersPositions )});
  }
  refreshPeersPositions(data) {
    this.peersPositions = data;
    console.log('refreshPeersPositions()');
    console.log(data);
  }
  ngOnInit() {
  }
  changeName(name) {
    this.firebaseService.changeName(name);
  }
  setUserId(id) {
    this.firebaseService.setUserId(parseInt(id, 0));
  }
  setMyCurrentPosition() {
    this.updateMyLocation();
  }
  updateMyLocation() {
    this.firebaseService.updateMyLocation();
  }
  addPeer(id) {
    console.log('add()' + id);
    this.firebaseService.addPeer(parseInt(id, 0));
  }
  refreshPeersPosition() {
    this.firebaseService.refreshPeersPosition();
  }
  startAutoRefresh() {
    console.log('startAutoRefresh()');
    this.timer = Observable.timer(0, 20000);
    this.timer.subscribe(t => {
      this.refreshPeersPosition();
      this.updateMyLocation();
    });
  }
}
