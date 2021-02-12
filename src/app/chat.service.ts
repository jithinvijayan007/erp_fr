import * as io from 'socket.io-client';

import { Observable } from 'rxjs';
import {Injectable} from '@angular/core';
import { URLSearchParams, RequestOptions } from '@angular/http';
import {Http, Headers, Response} from '@angular/http';
// import 'rxjs/Rx';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
// import 'rxjs/add/operator/catch';
// import { delay } from 'rxjs/operator/delay';
import { environment } from '../environments/environment';
@Injectable()
export class ChatService {
    // public url = 'http://192.168.0.106:3000/';

    protocol = window.location.protocol
    hostname = window.location.hostname
    port = environment.production ? 2021 : 3000;
    public url = `${this.protocol}//${this.hostname}:${this.port}/`;
    private socket;
    sender;
    constructor(private http: Http) {

        this.socket = io(this.url);

        this.socket.on('connect_error', function (data) {
        });

        this.socket.on('reconnect_failed', function (data) {
        });

    }


    // connection creates when a new user login
    createConnection(from, companyid , userlist ) {
      const loginData = {'from': from, 'companyid': companyid, 'userlist':userlist }
      this.socket.emit('create-connection', loginData);
    }
        // when a user signout
      public signout() {
        this.socket.emit('disconnect_user');
      }

    // when a user sends a message
    public sendMessage(message) {
      this.sender = message['from'];
      this.socket.emit('new-message1', message);
    }
    // when a user recieves a message
    public getMessages = () => {
      return Observable.create((observer) => {
        this.socket.on('new-message', (message) => {
          observer.next(message);
        });
      });
    }

// function called to recieve userlist and grouplist when a user login
    public getchatdata = () => {
      return Observable.create((observer) => {
        this.socket.on('login-data', (data) => {
          observer.next(data);
        });
      });
    }


    createGroup(groupdata) {
      this.socket.emit('create-group', groupdata);
    }

    // function called to recieve group chat messages
    getgroupchatdata(groupData) {
      this.socket.emit('get-group-messages', groupData);
    }

    // function called to recieve previous messages when a user login
    public getgroupchathistory = () => {
      return Observable.create((observer) => {
        this.socket.on('group-chat-history', (chatdetais) => {
          observer.next(chatdetais);
        });
      });
    }

    public sendGroupMessage(message) {
      this.socket.emit('new-group-message', message);
    }


    public getGroupMessages = () => {
      return Observable.create((observer) => {
        this.socket.on('group-message', (message) => {
          observer.next(message);
        });
      });
    }

// function called to reflect the newly created group
    public addNewlyCreatedGroup = () => {
      return Observable.create((observer) => {
        this.socket.on('new-group-added', (message) => {
          observer.next(message);
        });
      });
    }


    // request send to server for singlechat data
    getsinglechatdata(chatdata) {
      this.socket.emit('get-singlechat-messages', chatdata);
    }
    // recieves indvidual chat history
    public getsinglechathistory = () => {
      return Observable.create((observer) => {
        this.socket.on('chat-history', (chatdetais) => {
          observer.next(chatdetais);
        });
      });
    }

        // function called to inform seen status of all messages are true
        public setAllMessagesAsSeen = () => {
          return Observable.create((observer) => {
            this.socket.on('all-message-seen', (message) => {
              observer.next(message);
            });
          });
        }

          // function called to inform seen status of all messqges are true
          public setSingleMessagesAsSeen = () => {
            return Observable.create((observer) => {
              this.socket.on('single-message-seen', (message) => {
                observer.next(message);
              });
            });
          }

  // send Request To Update MsgSeen Status when user recieves a message
  sendRequestToUpdateMsgSeenStatus(updaterequestsender,reciever,msg_id) {
    this.socket.emit('recieves-message', { 'updaterequestsender': updaterequestsender, 'reciever': reciever, 'msg_id': msg_id});
  }
  sendAttachedFileToServer(formdata) {
this.http.post(this.url + 'serverrecievesfile', formdata ).subscribe((res: Response) => {
});
  }
  deleteselectedmsg(data) {
    this.http.post(this.url + 'deleteselectedsinglechatmessage', data ).subscribe((res: Response) => {
    });
  }

  clearmessage(data) {
    this.http.post(this.url + 'clearmessages', data ).subscribe((res: Response) => {
    });
  }

  sendTypingRequest(data) {
    this.http.post(this.url + 'typingInfo', data ).subscribe((res: Response) => {
    });
  }

  groupMessageDelete(data) {
    this.http.post(this.url + 'deletegroupmessage', data ).subscribe((res: Response) => {
    });
  }

  sendAttachedGroupFileToServer(formdata) {
    this.http.post(this.url + 'serverrecievesgroupfile', formdata ).subscribe((res: Response) => {
    });
   }
   saveGroupDetails(formdata) {
    this.http.post(this.url + 'savegroupdetails', formdata ).subscribe((res: Response) => {
    });
   }

   addFavourite(data) {
    this.http.post(this.url + 'addfavorite', data ).subscribe((res: Response) => {
    });
   }

   removefavorite(data) {
    this.http.post(this.url + 'removefavorite', data ).subscribe((res: Response) => {
    });
   }



  // function called to remove deleted message
  public removeMessageFromChat = () => {
    return Observable.create((observer) => {
      this.socket.on('remove-message', (message) => {
        observer.next(message);
      });
    });
  }

    // function called to remove deleted group message
    public removeMessageFromGroup= () => {
      return Observable.create((observer) => {
        this.socket.on('remove-group-message', (message) => {
          observer.next(message);
        });
      });
    }


// clear chat
  public clearChat = () => {
    return Observable.create((observer) => {
      this.socket.on('clear-chat', (message) => {
        observer.next(message);
      });
    });
  }

  // change active status
  public changeActiveStatus = () => {
    return Observable.create((observer) => {
      this.socket.on('change-activestatus', (message) => {
        observer.next(message);
      });
    });
  }

    // change typing-info
    public changeTypingStatus = () => {
      return Observable.create((observer) => {
        this.socket.on('typing-info', (message) => {
          observer.next(message);
        });
      });
    }

            // function called for push notification
            public recievePushNofitication = () => {
              return Observable.create((observer) => {
                this.socket.on('new-alert-recieved', (message) => {
                  observer.next(message);
                });
              });
            }
}
