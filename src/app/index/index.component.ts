import { ChatService } from './../services/chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit{
  title = 'app works!';
  entryIsView:boolean = false;

  btnName:string;
  constructor(private chatService:ChatService){
    //断开连接
    this.chatService.disconnect();
    console.log("constructor");
  }

  ngOnInit(){
    console.log("ngoninit");
  }

  //显示entryBox
  viewEntryBox(){
    this.entryIsView = true;
  }
  //隐藏entryBox
  hiddenEntryBox(){
    this.entryIsView = false;
  }

  //更改登录注册框的按钮名称
  changeBtnName(btnName:string){
    this.btnName = btnName;
  }
}
