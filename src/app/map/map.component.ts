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
  radius: number = 20;
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
  zoomChanged(zoom){
    console.log("zoomChange: " + zoom)
    this.zoom = zoom;
    switch(zoom){
      case 22: this.radius = 1; break;
      case 21: this.radius = 1; break;
      case 20: this.radius = 2; break;
      case 19: this.radius = 4; break;
      case 18: this.radius = 5; break;
      case 17: this.radius = 10; break;
      case 16: this.radius = 20; break;
      case 15: this.radius = 40; break;
      case 14: this.radius = 50; break;
      case 13: this.radius = 100; break;
      case 12: this.radius = 200; break;
      case 11: this.radius = 400; break;
      case 10: this.radius = 1000; break;
      case 9: this.radius = 2000; break;
      case 8: this.radius = 4000; break;
      case 7: this.radius = 5000; break;
      case 6: this.radius = 10000; break;
      case 5: this.radius = 40000; break;
      case 4: this.radius = 50000; break;
      case 3: this.radius = 100000; break;
      case 2: this.radius = 200000; break;
      case 1: this.radius = 500000; break;
    }
  }
}
