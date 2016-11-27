import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { PeerPosition } from '../position';

@Component({
  selector: 'us-app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  loggedIn: boolean = false;
  title: string = 'us';
  latitude: number;
  longitude: number;
  zoom: number = 16;
  peers;
  peersPositions: PeerPosition[];
  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.fbMyPosition.subscribe((positions) => this.setMyCurrentPosition(positions));
    this.firebaseService.bsPeersPositions.subscribe((peerPositions) => this.setPeersPosition(peerPositions));
    this.firebaseService.bsLoggedIn.subscribe((status) => this.loggedIn = status);
    // this.firebaseService.myPeersList.subscribe((peers) => this.setMyPeers(peers));
    // this.setMyCurrentPosition(this.firebaseService.getMyPosition());
    navigator.geolocation.getCurrentPosition(data => {
      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;
    });
  }
  ngOnInit() {
  }
  setPeersPosition(data: PeerPosition[]) {
    this.peersPositions = data;
    // console.log('setPeersPosition()');
  }
  setMyCurrentPosition(data) {
    // console.log('setMyCurrentPosition(1)');
    if(this.loggedIn === true) {
      //console.log('setMyCurrentPosition(2)');
      this.latitude = data[data.length - 1].position.latitude;
      this.longitude = data[data.length - 1].position.longitude;
    }


  }
}
