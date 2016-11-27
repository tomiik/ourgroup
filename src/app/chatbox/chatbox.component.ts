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
  mutter: string = '';
  mutters = [];
  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.bsPeersPositions.subscribe(() => {
      this.reColoring()
    });

    this.firebaseService.fbMutters.subscribe((mutters) => {
      this.getMutters(mutters)
    });
    //this.firebaseService.bsPeersPositions.subscribe((peersPositions) => {
    //  this.refreshPeersPositions( peersPositions )});
  }
  reColoring(){
    let color = '';
    let count = 0;
    for ( let i = this.mutters.length - 1; i > 0; i-- ) {
      color = this.firebaseService.getColorById( this.mutters[i].id );
      if ( color !== '' ) {
        count++;
      }
      if ( count < 5 ){
        this.mutters[i].color = color;
      } else {
        this.mutters[i].color = '';
      }
    }
  }
  getMutters(mutters) {
    this.mutters = [];
    console.log("getMutters")
    console.log(mutters);
    for ( let i = 0; i < mutters.length; i++) {
      console.log(mutters[i])
      console.log( mutters[i].id )
        this.mutters.push(
          {
            id: mutters[i].id,
            name: this.firebaseService.getNameById( mutters[i].id ),
            mutter: mutters[i].mutter,
            time: mutters[i].time,
            color: '',
          }
        );
    }
    this.reColoring();
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
  sendMutter(str){
    if (str !== '') {
      this.firebaseService.mutter(str);      
    }
    this.mutter = '';
  }
  enterkey(mutter){
    this.sendMutter(mutter);
  }

}
