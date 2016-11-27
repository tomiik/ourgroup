import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'us-app-peerlist',
  templateUrl: './peerlist.component.html',
  styleUrls: ['./peerlist.component.css']
})
export class PeerlistComponent implements OnInit {
  peersPositions;
  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.bsPeersPositions.subscribe((peersPositions) => {
      this.refreshPeersPositions( peersPositions )});
  }
  refreshPeersPositions(data) {
    this.peersPositions = data;
    this.peersPositions = data;
    console.log('refreshPeersPositions()');
    console.log(data);

  }

  ngOnInit() {
  }

}
