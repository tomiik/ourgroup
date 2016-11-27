import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FirebaseService {
  userId: number = 1;

  fbMyPeersList: FirebaseListObservable<any>;
  fbMyPosition: FirebaseListObservable<any>;
  fbMyMutters: FirebaseListObservable<any>;

  fbMyUserInfo: FirebaseListObservable<any>;

  fbUsers: FirebaseListObservable<any>;
  users = [];


  fbAllPositions: FirebaseListObservable<any>;
  allPositions;
  myLat: number = 51.678418;
  myLng: number = 7.809007;
  inputTime: number;
  peers;

  myUid: string = '';

  myName: string = '';
  public bsMyName: BehaviorSubject<any> = new BehaviorSubject([]);

  myKey: string = '';

  peersPositions = [];
  public bsPeersPositions: BehaviorSubject<any> = new BehaviorSubject([]);


  constructor(private af: AngularFire) {
    // this.af.auth.subscribe(auth => {
    //     console.log(auth);
    //     this.loggedon(auth.uid);
    //   });
    this.bsMyName.subscribe((name) => this.myName);


    this.fbUsers = af.database.list('/users/');
    this.fbUsers.subscribe(users => this.users = users);

    this.fbMyPeersList = af.database.list('/peerslist/' + this.userId);
    this.fbMyPeersList.subscribe(peers => this.peers = peers);

    this.fbMyPosition = af.database.list('/position/' + this.userId);

    this.fbAllPositions = af.database.list('/position/');
    this.fbAllPositions.subscribe((allPositions) => this.allPositions = allPositions);

    this.fbMyMutters = af.database.list('/mutters/' + this.userId);
  }
  loggedon(uid) {
    let exist = false;
    // console.log('loggedin:' + uid);
    // console.log(this.users);
    let user = this.users.filter(item => item.uid === uid);
     if (user.length > 0) {
     user = user[0];
      exist = true;
      this.myKey = user['$key'];
      this.myName = user['name'];
      this.bsMyName.next(this.myName);
      console.log("KnownUser()" + this.myKey);
    }

    if ( exist === false ) {
      this.addUser(uid, this.myName, this.users.length + 1);
    }
  }
  addUser(uid, name, id) {
  this.fbUsers.push(
    {
      uid: uid,
      name: this.myName,
      id: id,
    })
    .then(() => {
      console.log("added()");
      let key = this.users[this.users.length - 1].$key;
      this.myKey = key;
      this.bsMyName.next(this.myName);
    });
  }
  changeName(name) {
    this.setName(name, this.myKey);
  }
  setName(name, key) {
    console.log('setName' + this.myName + "->" + name + ",key:" + key);
    this.fbUsers.update(key,
      {
        name: name,
      });
      this.bsMyName.next(name);
  }
  login(email: string, password: string) {

    console.log("login:" + email + "/" + password);
    this.myName = email;
    this.af.auth.login({
      email: email,
      password: password,
    }).then((auth) => {
      console.log(auth);
      this.loggedon(auth.uid);
      // this.af.auth.subscribe(auth => {
      //     console.log(auth);
      //     this.loggedon(auth.uid);
      //   });
    })
  }
  setUserId(id) {
    this.userId = id;
    this.fbMyPeersList = this.af.database.list('/peerslist/' + this.userId);
    this.fbMyPosition = this.af.database.list('/position/' + this.userId);
  }
  getMyPosition() {
    return this.fbMyPosition;
  }
  saveMyPosition(pos) {
    this.fbMyPosition.push(
    {
      time: this.inputTime,
      position: {
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
        accuracy: pos.coords.accuracy
      }
    });
  }
  addPeer(id: number) {
    console.log('addPeer(' + id + ')');
    let peerlist = [];
    this.fbMyPeersList.subscribe(data => peerlist = data);
    let exist = peerlist.filter(data => data.id === id);
    if(exist.length == 0){
      let color = "'red'";
      switch (peerlist.length) {
        case 0: color = "LightSeaGreen"; break;
        case 1: color = "LightSalmon"; break;
        case 2: color = "MediumTurquoise"; break;
        case 3: color = "Orange"; break;
        case 4: color = "SlateBlue"; break;
      }
      this.fbMyPeersList.push({
        id: id,
        color: color,
        allowed: true,
      })
    }
  }
  getNameById(id) {
    console.log('getNameById' + id);
    console.log(this.users);
    let user = this.users.filter(item => item.id === id);
    console.log(user);
    let ret: string = '';
    if (user.length >= 0) {
      ret = user[0]['name'];
    }

    return ret;
  }

  getColorById(id) {
    console.log('getColorById' + id);
    //console.log(this.peers);
    let user = this.peers.filter(item => item.id === id);
    //console.log(user);
    let ret: string = '';
    if (user.length >= 0) {
      ret = user[0]['color'];
    }
    console.log(ret)
    return ret;
  }
  getPositionById(id) {
    console.log('getPositionById' + id);

    let pos = this.af.database.list('/position/' + id, {
      query: {
        limitToLast: 1,
        orderByKey: true
      }
    });
    let ret;
    pos.subscribe((posList) => {
      ret = posList[posList.length - 1];
    });
    return ret['position'];
  }
  updateMyLocation() {
    this.inputTime = Date.now();
    navigator.geolocation.getCurrentPosition(position => this.saveMyPosition(position));
  }
  refreshPeersPosition() {
    console.log('refreshPeersPosition()');
    // console.log("refreshPeersPosition()");
    let data = this.peers;
    let peersPositions = [];
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      //  console.log("id=" + data[i].id);
    if (data[i].allowed === true) {
         peersPositions.push({
           id: data[i].id,
           name: this.getNameById(data[i].id),
           color: this.getColorById(data[i].id),
           position: this.getPositionById(data[i].id)
         });
    }
      //  console.log(data[i].id);
      //  console.log(this.getPositionById(data[i].id));
    }
    this.bsPeersPositions.next(peersPositions);
  }
}
