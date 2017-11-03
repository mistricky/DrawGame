import { MsgService } from './../../services/msg.service';
import { OrganizeService } from './../../services/organize.service';
import { User } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {
  //需要显示的用户名
  userName:string;
  //未读消息数量
  msgCount:number = 0;

  constructor(private user:User,private router:Router, private organize:OrganizeService, private msgService:MsgService) { 
    
  }

  ngOnInit() {
    let obj = this.user.getUserInfo();
    this.userName = obj.user;

    //接收未读消息数量
    this.msgService.getMsgCount()
    .subscribe((msgCount:number) => {
      this.msgCount = msgCount;
    })
  }

  //转到好友列表
  linkFriendList(){
    this.router.navigate(['main/friendList']);
  }

  //注销用户
  exitUser(){
    this.router.navigate(['entry']);

    //销毁队伍
    this.organize.exitOrganize();
  }

  //跳转到msg-pane
  linkMsgPane(){
    this.router.navigate(['main/msg-pane']);
  }
}
