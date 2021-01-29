import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { SharedService } from '../../layouts/shared-service';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ChatService } from '../../chat.service';
import { ServerService } from '../../server.service';

import { ViewEncapsulation } from '@angular/core';
import { ChatComponent } from '../chat/chat/chat.component';
// import { imageOverlay } from 'leaflet';
// import { environment } from 'environments/environment';

@Component({
  selector: 'addition-navbar',
  templateUrl: './addition-navbar.component.html',
  styleUrls: ['./addition-navbar.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  host: {
    '[class.addition-navbar]': 'true',
    '[class.open]': 'open'
  },
})
export class AdditionNavbarComponent implements AfterViewInit {
  chatComponentPosition = 0;
  userProfileImagePath = this.serviceObject.hostAddress +"static/";
  selectedGroupImage;
  groupImagePath = "assets/images/nullimg.gif";
  defaultgroupImagePath = "assets/images/nullimg.gif";
  addGroupDetails: any = {
    groupName: '',
    members: []
  }

  editGroupDetails: any = {
    groupName: '',
    members: []
  }


  addGroup = false;
  editGroup = false;
  // variables used for chat services
  fromName = localStorage.getItem('username');
  fromImage = '';
  // companyId = '1';
  companyId = localStorage.getItem('companyId');
  chatOwnerData = [];
  userImageList = [];
  myGroups = [];
  userlist = [];
  myChatList = [];
  recentChats =[];
  favList = [];
  hostAddress = '';
  groupName = localStorage.getItem('group_name');

  selectedGroupId = '';
  groupChatList =[];
  // variable for chat service ends here
  title: string;
  open: boolean;
  // dialogRef: MatDialogRef<DialogResultComponent>;
  selectedOption: string;
  pageTitle: string = 'Dialog';

  constructor(public dialog: MatDialog, private _sharedService: SharedService ,
        public chatService: ChatService, private serviceObject:ServerService,
      private elRef: ElementRef ) {
    this.title = 'Addition navbar';
    this.open = false;
    this._sharedService.emitChange(this.pageTitle);

    this.hostAddress = this.chatService.url;
  }


  openNavbar() {
    this.open = !this.open;
  }
  showAddGroup() {
    this.groupImagePath = "assets/images/nullimg.gif";
    this.addGroup = true;
  }
  showEditGroup(groupid) {
    const selectegroupdetail = this.myGroups.filter(x=> x._id == groupid)

    this.editGroupDetails.members = selectegroupdetail[0]['members'].map((obj)=>{
      if(obj.username != this.fromName){
        return obj.username;
      }
      return;
    })

    this.editGroupDetails.groupName = selectegroupdetail[0].group_name;
    this.groupImagePath = "assets/images/nullimg.gif";
    this.editGroup = true;
  }
  ngAfterViewInit() {

    this.getUserImages(this.companyId);


                    // function called to change typing info
                    this.chatService
                    .changeTypingStatus()
                    .subscribe((data: string) => {
                      const datarecieved = data;
                      if(this.myChatList.filter(x=> x.name == datarecieved['chatowner']).length > 0) {
                        if(datarecieved['type'] == 'FOCUS') {
                          this.myChatList.filter(x=> x.name == datarecieved['chatowner'])[0]['typingstatus'] = true;
                        } else{
                        this.myChatList.filter(x=> x.name == datarecieved['chatowner'])[0]['typingstatus'] = false;
                      }
                    }
                });






          // recieves when a new message arrives
          this.chatService
          .getMessages()
          .subscribe((message: any) => {
            let datarecieved = message;

            const tempmsg = message;
            if(datarecieved['from'] == this.fromName){
              datarecieved['chatpartner'] = datarecieved['to']
            } else {
              datarecieved['chatpartner'] = datarecieved['from']
            }

            // if the sender is already in recent list
            if(this.recentChats.filter(x=>x.chatpartner == datarecieved['chatpartner']).length > 0) {

              this.recentChats = this.recentChats.map((x) => {
                if (x.chatpartner == datarecieved['to'] || x.chatpartner == datarecieved['from']) {
                  tempmsg['fname'] = x['fname'] ;
                  tempmsg['lname'] =  x['lname'];
                  tempmsg['profile_pic'] =  x['profile_pic'];
                  tempmsg['chatpartner'] =  x['chatpartner'];
                  tempmsg['activestatus'] =  x['activestatus'];
                  x = tempmsg
                  return x
                }
                return x;
              })

            } else{
              const userdata = this.userlist.filter(x=>x.username == datarecieved['chatpartner'])[0]
              tempmsg['fname'] = userdata['firstname']
              tempmsg['lname'] =  userdata['lastname']
              tempmsg['profile_pic'] =  userdata['profile_pic']
              tempmsg['activestatus'] =  userdata['activestatus'];
              this.recentChats.push(tempmsg);
            }



          this.recentChats.sort(function(a, b){
            let dateA = +new Date(a.send_dt);
             let dateB = +new Date(b.send_dt) ;
          let diff = dateB - dateA;
             return diff
             })

            if(message['from']==this.fromName){   // msg send from current user
            tempmsg['chatpartner'] = datarecieved['to'];
            this.myChatList.filter(x=>x.name ==  datarecieved['to'])[0].messages.push(datarecieved);
            } else if(message['to']==this.fromName){ // if message from another user
              if(this.myChatList.filter(x=> x.name == datarecieved['from']).length > 0) { // if the chat of the message sender is opened
                this.myChatList.filter(x =>x.name ==  datarecieved['from'])[0].messages.push(datarecieved);
                this.chatService.sendRequestToUpdateMsgSeenStatus(this.fromName,datarecieved['from'],datarecieved['_id']);
              } else {  // if the chat of message sender is closed
                const userdetails = this.userlist.filter(x =>x.username == datarecieved['from'])[0]
                this.getChat('testid', datarecieved['from'] , userdetails['firstname'],userdetails['lastname']);
              }
            }

          });

        // recieves chat userlist and group list of the user
        this.chatService
        .getchatdata()
        .subscribe((data: string) => {
          const datarecieved = data;
          // this.recentChats = data['recent_chat_details'];
          this.userlist = data['user_list'];
          // this.myGroups = data['group_data'];
          // this.favList = data['favlist'];
          const favlistlocal = data['favlist'];
          const recentchatlocal = data['recent_chat_details'];

          this.recentChats = [];
          recentchatlocal.map((rec) => {
            const userdetail = this.userlist.filter(x=>x.username == rec.chatpartner);
            if(userdetail.length > 0){
              rec['profile_pic'] = userdetail[0]['profile_pic'];
              rec['activestatus'] = userdetail[0]['activestatus'];
              this.recentChats.push(rec)
            }
          })

          this.favList = []
          favlistlocal.map((fav) => {
            const userdetail = this.userlist.filter(x=>x.username == fav.fav_username);
            if (userdetail.length > 0) {
              fav['firstname'] = userdetail[0]['firstname'];
              fav['lastname'] = userdetail[0]['lastname'];
              fav['activestatus'] = userdetail[0]['activestatus'];
              fav['profile_pic'] = userdetail[0]['profile_pic'];
              this.favList.push(fav)
            }
          })
          // this.userlist.map((user)=>{
          //   const userimagedetails = this.userImageList.filter(x=> x.username = user.username);
          //   if(userimagedetails.length > 0){
          //     user['imagepath'] =this.serviceObject.hostAddress +"static/" +userimagedetails[0]['vchr_profile_pic'];
          //     return user;
          //   }
          //   })

        });

      // recieves single chat history
      this.chatService
      .getsinglechathistory()
      .subscribe((data: string) => {
        const datarecieved = data;
        this.myChatList.filter(x=>x.name ==  datarecieved['toname'])[0].messages = datarecieved['message_data'];
      });



      // function called to update seen status of all messsges as true
      this.chatService
      .setAllMessagesAsSeen()
      .subscribe((data: string) => {
        const datarecieved = data;
          if(this.myChatList.filter(x=> x.name == datarecieved['message-seen-user']).length > 0) {
          for(const obj of (this.myChatList.filter(x=> x.name ===  datarecieved['message-seen-user'])[0].messages).filter(x=> x.from === this.fromName && x.read_status === false) ) {
            obj['read_status'] = true;
          }
          }
        });


       // function called to update seen status of a single messsges as true
      this.chatService
      .setSingleMessagesAsSeen()
      .subscribe((data: string) => {
        const datarecieved = data;

        if(this.myChatList.filter(x => x.name === datarecieved['message-seen-user']).length > 0) {
        for(const obj of (this.myChatList.filter(x => x.name ===  datarecieved['message-seen-user'])[0].messages).filter(x => x._id === datarecieved['message_id']) ) {
          obj['read_status'] = true;
        }
      }
   });


      // function called to change active status
      this.chatService
      .changeActiveStatus()
      .subscribe((data: string) => {
        const datarecieved = data;
        // this.myChatList.filter(x => x.name == datarecieved['user'] )[0]['activestatus'] = datarecieved['status'];
        // this.userlist.filter(x => x.username === datarecieved['user'])[0]['activestatus'] = datarecieved['status'];
        // this.favList.filter(x => x.fav_username === datarecieved['user'])[0]['activestatus'] = datarecieved['status'];
        // this.recentChats.filter(x => x.chatpartner === datarecieved['user'])[0]['activestatus'] = datarecieved['status'];


        if(this.myChatList.filter(x => x.name === datarecieved['user']).length > 0) {
          this.myChatList.filter(x => x.name == datarecieved['user'] )[0]['activestatus'] = datarecieved['status'];
        }
        if(this.userlist.filter(x => x.username === datarecieved['user']).length > 0) {
          this.userlist.filter(x => x.username === datarecieved['user'])[0]['activestatus'] = datarecieved['status'];
        }
        if(this.favList.filter(x => x.fav_username === datarecieved['user']).length > 0) {
          this.favList.filter(x => x.fav_username === datarecieved['user'])[0]['activestatus'] = datarecieved['status'];
        }
        if(this.recentChats.filter(x => x.chatpartner === datarecieved['user']).length > 0) {
        this.recentChats.filter(x => x.chatpartner === datarecieved['user'])[0]['activestatus'] = datarecieved['status'];
        }

  });


                 // function called to clear a chat
                 this.chatService
                 .clearChat()
                 .subscribe((data: string) => {
                   const datarecieved = data;
                   if(this.myChatList.filter(x=> x.name == datarecieved['chatowner']).length > 0) {
                     this.myChatList.filter(x=> x.name ==  datarecieved['chatowner'])[0].messages = [];
                 }
              });


        this.chatService
        .getgroupchathistory()
        .subscribe((data: any) => {
          let datarecieved = data;
          datarecieved['message_data'] = datarecieved['message_data'].map((msgdata)=> {
            const userImageData = this.userlist.filter( x=> x.username == msgdata['from']);
            if(userImageData.length > 0) {
              msgdata['profilepic'] = userImageData[0]['profile_pic'];
            }
            return msgdata
          })

          this.groupChatList.filter(x => x.id ===  datarecieved['group_id'])[0].groupmessages = datarecieved['message_data'];

        });




      // recieves group chat messages
      this.chatService
      .getGroupMessages()
      .subscribe((data: string) => {
        const datarecieved = data['groupchatobj'];
        if (datarecieved['from'] === this.fromName) {   // msg send from current user
          this.groupChatList.filter(x => x.id ===  datarecieved['group_id'])[0].groupmessages.push(datarecieved);
          } else {
            const userImageData = this.userlist.filter( x=> x.username == datarecieved['from']);
            if(userImageData.length > 0) {
              datarecieved['profilepic'] = userImageData[0]['profile_pic'];
            }
            if (this.groupChatList.filter(x => x.id === datarecieved['group_id']).length > 0) {
               // if the chat of the message sender is opened
              this.groupChatList.filter(x => x.id ===  datarecieved['group_id'])[0].groupmessages.push(datarecieved);
            } else {  // if the chat of message sender is closed
              let instmygroup = this.myGroups.filter(x=> x._id == datarecieved['group_id'] )
              this.getGroupChat(datarecieved['group_id'], data['groupname'], instmygroup[0].group_icon );
            }
          }
      });


            // recieves when a new group is created
            this.chatService
            .addNewlyCreatedGroup()
            .subscribe((data: string) => {
              const datarecieved = data;
              this.myGroups.push(datarecieved);
            });


   }





     // request for group chat using id
  getGroupChat(groupid , groupname,groupicon) {

    if (this.groupChatList.filter(x => x.id === groupid).length === 0) {
    this.groupChatList.push({
      id: groupid,
      groupname: groupname,
      groupmessages: [],
      newgroupmessage : '',
      groupicon : groupicon,
    });

    this.selectedGroupId = groupid;
    const pushedItems = {};
    pushedItems['from'] = this.fromName;
    pushedItems['group_id'] = groupid;
    pushedItems['groupname'] = groupname;
    this.chatService.getgroupchatdata(pushedItems);
  } else {
    this.groupChatList = this.groupChatList.filter(x => x.id !== groupid);
  }
  }


   login() {
       this.chatService.createConnection(this.fromName, this.companyId,this.userImageList);
  }

  getChat(id, toname , firstname , lastname) {
    // if the chat tab is currently closed
    if (this.myChatList.filter(x => x.name === toname).length === 0) {
      let chatuser = this.userlist.filter(userdata => userdata.username === toname);
      let profpic = '';
      let activestatus = false;
      if(chatuser.length > 0){
        profpic = chatuser[0]['profile_pic'];
        activestatus = chatuser[0]['activestatus'];
      }
      this.myChatList.push({
        id: id,
        name: toname,
        messages: [],
        newmessage : '',
        fileupload: '',
        tab_id: this.myChatList.length ,
        fullname : firstname + ' ' + lastname,
        profilepic: profpic,
        activestatus: activestatus,
        typingstatus: false
      });
      const pushedItems = {};
      pushedItems['fromname'] = this.fromName;
      pushedItems['toname'] = toname;
      pushedItems['tab_id'] = this.myChatList.length - 1 ;
      this.chatService.getsinglechatdata(pushedItems);

    } else {
      // if the chat is currently opened
      this.myChatList = this.myChatList.filter(x => x.name !== toname);
    }

  }

  recentChatFunc(from, to) {
    let user;
    if (this.fromName === from) {
      user = this.userlist.filter(x => x.username === to);
    } else {
      user = this.userlist.filter(x => x.username === from);
    }
    user = user[0];
    this.getChat(user['_id'], user['username'], user['firstname'] , user['lastname'])
  }

  addtofavorite(fav_username) {
    // checks wheather the user only in favourites
    if(this.favList.filter(x=> x.fav_username == fav_username).length == 0){
      const pushedItems = {};
      pushedItems['username'] = this.fromName;
      pushedItems['fav_username'] = fav_username;
      this.chatService.addFavourite(pushedItems);
      const ins_user = this.userlist.filter(x => x.username == fav_username)
      if(ins_user.length > 0 ){
        pushedItems['firstname'] = ins_user[0].firstname;
        pushedItems['lastname'] = ins_user[0].lastname;
        pushedItems['profile_pic'] = ins_user[0].profile_pic;
        pushedItems['activestatus'] = ins_user[0].activestatus;
        this.favList.push(pushedItems);
      }
    }

  }
  removefavorite(fav_username) {
    const pushedItems = {};
    pushedItems['username'] = this.fromName;
    pushedItems['fav_username'] = fav_username;
    this.chatService.removefavorite(pushedItems);
    this.favList = this.favList.filter(x=> x.fav_username != fav_username )
  }
  closeChat(username) {
    this.myChatList = this.myChatList.filter(x => x.name !== username);
  }
  closeGroupChat(groupid) {
    this.groupChatList = this.groupChatList.filter(x => x.id !== groupid);
  }

  clearchat( chatpartner ) {
    const pushedItems = {};
    pushedItems['chatpartner'] = chatpartner;
    pushedItems['requestsender'] = this.fromName;
    this.chatService.clearmessage(pushedItems);

    this.recentChats = this.recentChats.filter(x=> x.chatpartner != chatpartner)
  }

  addMemberToGroup(username){
    if(this.addGroupDetails.members.includes(username)){
      this.addGroupDetails.members = this.addGroupDetails.members.filter(item=> item != username)
    } else {
      this.addGroupDetails.members.push(username)
    }

  }
  addMemberToEditGroup(username){
    if(this.editGroupDetails.members.includes(username)){
      this.editGroupDetails.members = this.editGroupDetails.members.filter(item=> item != username)
    } else {
      this.editGroupDetails.members.push(username)
    }

  }

  onFileChange(event: any) {
    // only if file selected

    if( event.target.value){
      const files = event.target.files;
      const file = files[0];
      this.selectedGroupImage = file;
      let reader;
      reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }
  _handleReaderLoaded(readerEvt) {
    const base64textString = btoa(readerEvt.target.result);
    this.groupImagePath = 'data:image/png;base64,' + base64textString;
}
  fileManager(fileInput) {
    fileInput.click();
  }
  saveNewGroup(){

    if(!this.selectedGroupImage){
    } else if (!this.addGroupDetails['groupName']){
    } else if(this.addGroupDetails['members'].length == 0){
    } else {
      let formdata = new FormData;
      formdata.append('groupimage', this.selectedGroupImage);
      formdata.append('groupname', this.addGroupDetails['groupName']);
      formdata.append('members', this.addGroupDetails['members']);
      formdata.append('admin', this.fromName);
      this.chatService.saveGroupDetails(formdata);

      this.selectedGroupImage= null;
      this.addGroupDetails['groupName'] = null;
      this.addGroupDetails['members'] = [];
      this.groupImagePath = this.defaultgroupImagePath;
      this.addGroup = false
    }
  }

  getUserImages(companyid) {
    const pusheditems = {};
    pusheditems['companyid'] = companyid;
    pusheditems['username'] = this.fromName;
    this.serviceObject.postData('user/getuserimagelistdata/',pusheditems).subscribe(
      result => {
        if(result['status'] == 1) {
          this.userImageList = result['data'];
          this.chatOwnerData = result['chatOwnerData']
          this.fromImage =  (this.chatOwnerData[0]) ? this.chatOwnerData[0]['vchr_profile_pic'] : '';
          this.login();
        }
      },
      error => {
        // swal("Error", error, "error");
      }
    );
  }

  // getChatPosition(){
  //   if(this.chatComponentPosition <= 900 ){
  //     this.chatComponentPosition = this.chatComponentPosition + 300;
  //     return this.chatComponentPosition + 'px';
  //   } else {
  //     this.chatComponentPosition = 0 + 300;
  //     return this.chatComponentPosition + 'px';
  //   }
  // }

  updateGroup(){

    if(!this.selectedGroupImage){
        } else if (!this.editGroupDetails['groupName']){
        } else if(this.editGroupDetails['members'].length == 0){
        } else {
          let formdata = new FormData;
          formdata.append('groupimage', this.selectedGroupImage);
          formdata.append('groupname', this.editGroupDetails['groupName']);
          formdata.append('members', this.editGroupDetails['members']);
          formdata.append('admin', this.fromName);
          // this.chatService.saveGroupDetails(formdata);

          this.selectedGroupImage= null;
          this.editGroupDetails['groupName'] = null;
          this.editGroupDetails['members'] = [];
          this.groupImagePath = this.defaultgroupImagePath;
          this.editGroup = false
        }



  }
}
