import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
//declare var $:JQueryStatic;
declare var $ : any;

@Component({
  selector: 'us-app-peerlist',
  templateUrl: './peerlist.component.html',
  styleUrls: ['./peerlist.component.css']
})
export class PeerlistComponent implements OnInit {
  peersPositions = [];
  modal_id: number;
  users = [];
  loggedIn: boolean = false;
  userId: number = 0;

  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.bsPeersPositions.subscribe((peersPositions) => {
      this.refreshPeersPositions( peersPositions )});

    this.firebaseService.fbUsers.subscribe((users) => { this.users = users });
    this.firebaseService.bsLoggedIn.subscribe((status) => this.loggedIn = status);
    this.firebaseService.bsUserId.subscribe((userid) => this.userId = userid);
      $(document).ready(function(){
      // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
      });
  }
  refreshPeersPositions(data) {
    this.peersPositions = data;
    //console.log('refreshPeersPositions()');
    //console.log(data);
  }

  ngOnInit() {
  }
  deletePeer(item){
    console.log("close(" + item + ")")
    console.log(item);
    this.firebaseService.deletePeer(item.id);
  }
  addPeer(id) {
    console.log('add()' + id);
    this.firebaseService.addPeer(parseInt(id, 0));
  }

}
