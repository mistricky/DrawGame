import { User } from './../../../services/user.service';
import { DialogClose } from './../../../dialog/dialog-close';
import { DialogModelSchema } from './../../../interfaces/dialog-schema.interface';
import { Observable } from 'rxjs/Observable';
import { ChatService } from './../../../services/chat.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector:"tab",
    templateUrl:"./tab.component.html",
    styleUrls:["./tab.component.css"]
})
export class TabComponent extends DialogClose{
    constructor(private chatService:ChatService,private router:Router,private user:User){
        super();
    }

    //对话框数据模型
    dialogModel:DialogModelSchema;

    //配置dialogmodel
    dialogInit(){
        this.showDialog({
            title:"提示信息",
            message:"匹配中...",
            buttonIndex:0,
            isViewImg:true
        });
    }

    //单人匹配点击回调
    alone(){
        this.dialogInit();
        this.chatService.match([this.user.getUserInfo().user]);
        let observable:Observable<boolean> = this.chatService.matchSuccessful();
        observable.subscribe(data => {
            if(data){
                //关闭对话框
                this.close();
                //匹配成功后打开主页面
                console.log("匹配成功");
                this.router.navigate(['main/game-pane']);
            }
        })
    }

    //好友同玩按钮点击回调
    friend(){
        this.router.navigate(['main/friend-game',{queryParams:{}}]);
    }
}