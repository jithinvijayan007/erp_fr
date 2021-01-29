import { Component,Output, OnInit, Input  , OnChanges, SimpleChanges,ElementRef,ViewChild} from '@angular/core';
import { ChatService } from '../../../chat.service';
import { EventEmitter } from '@angular/core';
import {  AfterViewChecked} from '@angular/core';
import { ServerService } from 'src/app/server.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  host: {
    '[class.chat]': 'true',
    '[class.open]': 'open'
  }
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @Output() closeChatEvent = new EventEmitter();
  @Input() chats: any;
  @Input() fromName: string;
  @Input() fromImage: string;
  @Input() hostAddress: string;
  tempi = true;

  temporaryMessageLengthStoringFlag =0;

  classToShowTheCHat ='';
  // @Input() userlist;
  // models used
  currentuserstatus = false;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('msginputdiv') private msginputdiv: ElementRef;


  userProfileImagePath = this.serviceObject.hostAddress +"static/";
  title: string;
  open: boolean;

  constructor( public chatService: ChatService , public serviceObject : ServerService ) {
    this.title = 'Chating';
    // this.open = false;
  }

  ngOnInit() {
    this.open = !this.open;
  }

    ngAfterViewChecked() {
    if(this.chats['messages'].length > 0) {
      this.scrollToBottom();
    }
  }


  // ngOnChanges(changes: SimpleChanges) {
  //   this.scrollToBottom();
  // }


scrollToBottom(): void {
  if(this.temporaryMessageLengthStoringFlag != this.chats['messages'].length) {
    try {
      this.temporaryMessageLengthStoringFlag = this.chats['messages'].length;
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }

  }


}
  openNavbar1() {
    this.open = !this.open;
  }
  sendSingleMessage(msg,msgto){
    if(msg != null) {
      if(msg.trim() != ''){
        const pushedItems = {};
        pushedItems['from'] = this.fromName;
        pushedItems['to'] = msgto;
        pushedItems['message'] = msg;
        this.chatService.sendMessage(pushedItems);
        // this.myChatList.filter(x=> x.name == msgto)[0]['newmessage'] ='';
        this.chats['newmessage']='';
      }
    }

  }
  functionFocusChange(chatpartner, type) {
    const pushedItems = {};
    pushedItems['chatpartner'] = chatpartner;
    pushedItems['requestsender'] = this.fromName;
    pushedItems['type'] = type;
    this.chatService.sendTypingRequest(pushedItems);
}
fileManager(fileInput) {
  fileInput.click();
}


onFileChange(event: any, toname) {
  // only if file selected
  if( event.target.value){
    const files = event.target.files;
    const file = files[0];
    let formdata = new FormData;
    formdata.append('sendingfile',file);
    formdata.append('to', toname);
    formdata.append('from', this.fromName);
    this.chatService.sendAttachedFileToServer(formdata);
    event.target.value = null;
  }
}

closechatfunc(username){
  this.closeChatEvent.next(username);
}
minimizeChat(){
  if(this.classToShowTheCHat == 'chatFrameMinimized'){
    this.classToShowTheCHat = '';
    this.myScrollContainer.nativeElement.hidden = false;
    this.msginputdiv.nativeElement.hidden = false;
  } else {
    this.classToShowTheCHat = 'chatFrameMinimized';
    this.myScrollContainer.nativeElement.hidden = true;
    this.msginputdiv.nativeElement.hidden = true;

  }
}

saveImage(img) {
  const importantStuff = window.open("", "_blank");
  importantStuff.location.href = img;
}

}

