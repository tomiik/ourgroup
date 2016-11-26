import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { PeerPosition } from '../position';

@Component({
  selector: 'us-app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  title: string = 'us';
  latitude;
  longitude;
  zoom: number = 16;
  peers;
  peersPositions: PeerPosition[];
  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.fbMyPosition.subscribe((positions) => this.setMyCurrentPosition(positions));
    this.firebaseService.bsPeersPositions.subscribe((peerPositions) => this.setPeersPosition(peerPositions));
    // this.firebaseService.myPeersList.subscribe((peers) => this.setMyPeers(peers));
    // this.setMyCurrentPosition(this.firebaseService.getMyPosition());
  }
  ngOnInit() {
  }
  setPeersPosition(data: PeerPosition[]) {
    this.peersPositions = data;
    console.log('setPeersPosition()');
  }
  setMyCurrentPosition(data) {
    this.latitude = data[data.length - 1].position.latitude;
    this.longitude = data[data.length - 1].position.longitude;
  }
}
