import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { Util } from './lib'
const log: boolean = true;

@Injectable()
export class FirebaseService {
  timer; // for Auto Refresh
  autoRefreshSubscribe;

  userId: number = 0;
  public bsLoggedIn: BehaviorSubject<any> = new BehaviorSubject([]);


  fbMyPeersList: FirebaseListObservable<any>;
  fbMyPosition: FirebaseListObservable<any>;
  fbMutters: FirebaseListObservable<any>;

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
    //     this.log(auth);
    //     this.loggedon(auth.uid);
    //   });
    this.bsLoggedIn.next(false);

    this.bsMyName.subscribe((name) => this.myName);

    this.fbUsers = af.database.list('/users/');
    this.fbUsers.subscribe(users => this.users = users);

    this.fbMyPeersList = af.database.list('/peerslist/' + this.userId);
    this.fbMyPeersList.subscribe(peers => this.peers = peers);

    this.fbMyPosition = af.database.list('/position/' + this.userId,{
    query: {
      limitToLast: 1,
      orderByKey: true
    }});

    this.fbAllPositions = af.database.list('/position/');
    this.fbAllPositions.subscribe((allPositions) => this.allPositions = allPositions);

//    this.fbMyMutters = af.database.list('/mutters/' + this.userId);
    this.fbMutters = af.database.list('/mutters/',
    {
    query: {
      limitToLast: 20,
      orderByKey: true
    }});
  }
  addUser(uid, name, id) {
  this.fbUsers.push(
    {
      uid: uid,
      name: this.myName,
      id: id,
    })
    .then(() => {
      this.log('added()');
      let key = this.users[this.users.length - 1].$key;
      this.myKey = key;
      this.bsMyName.next(this.myName);
    });
  }
  changeName(name) {
    this.setName(name, this.myKey);
  }
  setName(name, key) {
    this.log('setName: ' + this.myName + ' -> ' + name + ',key:' + key);
    this.fbUsers.update(key,
      {
        name: name,
      });
      this.bsMyName.next(name);
  }
  login(email: string, password: string) {
    this.log('login:' + email + '/' + password);
    this.myName = email;
    this.af.auth.login({
      email: email,
      password: password,
    }).then((auth) => {
      this.log(auth);
      this.loggedon(auth.uid);
      // this.af.auth.subscribe(auth => {
      //     this.log(auth);
      //     this.loggedon(auth.uid);
      //   });
    });
  }
  loggedon(uid) {
    let exist = false;
    // this.log('loggedin:' + uid);
    // this.log(this.users);
    let user = this.users.filter(item => item.uid === uid);
     if (user.length > 0) {
     user = user[0];
      exist = true;
      this.myKey = user['$key'];
      this.myName = user['name'];
      this.userId = user['id'];
      this.bsMyName.next(this.myName);
      this.log('KnownUser(): ' + this.myKey);
      this.setUserId(this.userId);
    }

    if ( exist === false ) {
      this.addUser(uid, this.myName, this.users.length + 1);
      this.setUserId(this.userId);
    }
    this.bsLoggedIn.next(true);
    this.mutter(' Log in: ' + this.myName);
    this.startAutoRefresh();
  }

  logout() {
   this.af.auth.logout();
   this.bsLoggedIn.next(false);
   this.mutter(' Log out: ' + this.myName);
   this.stopAutoRefresh();
  }
  setUserId(id) {
    this.log("setUserId(" + id + ")")
    this.userId = id;
    this.fbMyPeersList = this.af.database.list('/peerslist/' + this.userId);
    this.fbMyPeersList.subscribe(peers => this.peers = peers);
    this.fbMyPosition = this.af.database.list('/position/' + this.userId);
  }
  getMyPosition() {
    return this.fbMyPosition;
  }
  updateMyLocation() {
    this.log("updateMyLocation()")
    this.inputTime = Date.now();
    navigator.geolocation.getCurrentPosition(position => this.saveMyPosition(position));
  }
  saveMyPosition(pos) {
    this.log("saveMyPosition()")
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
    this.log('addPeer(' + id + ')');
    let peerlist = [];
    this.fbMyPeersList.subscribe(data => peerlist = data);
    let exist = peerlist.filter(data => data.id === id);
    if (exist.length === 0) {
      let color = 'red';
      color = Util.getColorByNumber(peerlist.length);
      this.fbMyPeersList.push({
        id: id,
        color: color,
        allowed: true,
      })
      .then(() => this.refreshPeersPosition())
    }
  }
  reColoring() {
    //console.log("reColoring");
    let peerlist = [];
    this.fbMyPeersList.subscribe(data => peerlist = data);
    for (let i = 0; i < peerlist.length; i++) {
      this.fbMyPeersList.update(peerlist[i].$key, {
        color: Util.getColorByNumber(i),
      });
    }
    this.refreshPeersPosition();
  }
  deletePeer(id) {
    this.log('delete(' + id + ')');
    let peerlist = [];
    this.fbMyPeersList.subscribe(data => peerlist = data);
    let exist = peerlist.filter(data => data.id === id);
    if (exist.length > 0) {
      this.fbMyPeersList.remove(exist[0].$key)
      .then(() => {
        this.reColoring();
        //this.refreshPeersPosition()
      });
    }
  }
  getNameById(id) {
     this.log('getNameById' + id);
     this.log(this.users);
    let user = this.users.filter(item => item.id === id);
    // this.log(user);
    let ret = '';
    if (user.length >= 0) {
      ret = user[0]['name'];
    }
    return ret;
  }
  getColorById(id) {
    if(id === 0){
      return 'black';
    }
    // this.log('getColorById' + id);
    // this.log(this.peers);
    let user = this.peers.filter(item => item.id === id);
    // this.log(user);
    let ret = '';
    if (user.length > 0) {
      ret = user[0]['color'];
    }
    // this.log(ret)
    return ret;
  }
  getIdByUid(uid) {
    let user = this.users.filter(item => item.uid === uid);
    // this.log(user);
    let ret = '';
    if (user.length >= 0) {
      ret = user[0]['id'];
    }
    return ret;
  }
  getPositionById(id) {
    // this.log('getPositionById' + id);
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
    return {position: ret['position'], time: ret['time']};
  }

  refreshPeersPosition() {
    this.log('refreshPeersPosition()');
    //this.log("refreshPeersPosition()");
    let data = this.peers;
    let peersPositions = [];
    //this.log(data);
    for (let i = 0; i < data.length; i++) {
      //  this.log("id=" + data[i].id);
    if (data[i].allowed === true) {
      let pos = this.getPositionById(data[i].id);
         peersPositions.push({
           id: data[i].id,
           name: this.getNameById(data[i].id),
           color: this.getColorById(data[i].id),
           position: pos['position'],
           time: pos['time'] - Date.now(),
         });
    }
      //  this.log(data[i].id);
      //  this.log(this.getPositionById(data[i].id));
    }
    this.bsPeersPositions.next(peersPositions);
  }
  startAutoRefresh() {
    this.log('startAutoRefresh()');
    this.timer = Observable.interval(3000);
    this.autoRefreshSubscribe = this.timer.subscribe(t => {
      this.updateMyLocation();
      this.refreshPeersPosition();
    });
  }
  stopAutoRefresh() {
    this.autoRefreshSubscribe.unsubscribe();
  }
  log(str) {
    if (log) {
      console.log(str);
    }
  }
  mutter(str){
    let time = Date.now();
    this.fbMutters.push({
      id: this.userId,
      time: time,
      mutter: str,
    });
  }
}
