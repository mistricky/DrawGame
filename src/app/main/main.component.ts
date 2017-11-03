import { MsgService } from './../services/msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogClose } from './../dialog/dialog-close';
import { DialogModelSchema } from './../interfaces/dialog-schema.interface';
import { ChatService } from './../services/chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent extends DialogClose implements OnInit {

  constructor(private chatService:ChatService, private router:Router,private msgService:MsgService, private activatedRoute:ActivatedRoute) {
    super();
    //连接服务器
    chatService.connect();
  }

  ngOnInit() {
    //接收用户请求
    this.chatService.getRequest()
    .subscribe((data:any) => {
      this.showDialog({
        title:"提示信息",
        message:`${data.user}邀请你加入队伍一起游戏`,
        buttonIndex:2,
        btn1:{title:'接受',color:"green",func:() => {
          console.log("dsasadsa");
            this.router.navigate(['main/friend-game'],{queryParams:{first:data.first}})
            this.close();
        }},
        btn2:{title:'拒绝',color:"red",func:() => {
            this.close();
        }}
      });
    })

    this.msgService.getMsg()
    .subscribe(msg => {
      //判断是否消息路由
      if(window.location.pathname != '/main/msg-pane'){
        console.log("未读消息");
        this.msgService.addMsgCache(msg);
        this.msgService.setMsgCount();
        console.log(this.msgService.getMsgCount());
      }     
    })

  }
  
}
