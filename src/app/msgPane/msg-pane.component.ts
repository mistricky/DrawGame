import { MsgItemModel } from './../models/msg-item.model';
import { MsgItemComponent } from './../msgItem/msgItem.component';
import { ChatService } from './../services/chat.service';
import { Response } from '@angular/http';
import { MsgService } from './../services/msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { chatUser } from './../interfaces/chat-user-schema.interface';
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, AfterViewChecked } from '@angular/core';

@Component({
    selector:"msg-pane",
    templateUrl:"./msg-pane.component.html",
    styleUrls:['./msg-pane.component.css']
})
export class MsgPaneComponent implements AfterViewInit,OnInit,AfterViewChecked{
    constructor(private router:Router, private activatedRoute:ActivatedRoute, private msgService:MsgService, private chatService:ChatService){

    }

    //选择条位置
    barLocation:number = 0;
    //联系人列表数据源
    chatUsers:Array<chatUser> = [];
    //当前选择的联系人名称
    selectUserName:string;
    //消息项目数组
    msgItemArr:Array<MsgItemModel> = [];

    //获取指定用户的数据模型对象
    getUser(userName:string){
        for(let val of this.chatUsers){
            if(val.userName == userName){
                return val;
            }
        }
    }
    
    //联系人点击回调
    changeBg(target:HTMLDivElement,userName:string){
        let tagName = target.tagName;
        if(tagName != 'BUTTON' && tagName != 'P' && tagName != 'IMG'){
            this.barLocation = target.offsetTop;
        }
        this.selectUserName = userName;

        //读取当前联系人的聊天记录
        let user = this.getUser(userName);
        //复制数组防止重复发送消息
        let arr = user.content.concat();
        this.msgItemArr = arr;
    }

    //跳转到指定用户项目
    linkTargetUserItem(userName:string){
        let index;
        for(let val of this.chatUsers){
            if(val.userName == userName){
                index = this.chatUsers.indexOf(val);
            }
        }

        let children = this.userList.nativeElement.children;
        this.changeBg(children[index],userName);
    }

    //添加用户
    addUser(userName:string,func?:Function){
         //添加用户
        this.msgService.addUser(userName)
        .subscribe((res:Response) => {
            let data = res.json().successful[0];
            //添加至数组
            this.msgService.addUserToArray({
                userName:data.user,
                headImg:data.headImgPath || "../../assets/imgs/headImg.jpg",
                isLine:data.isLine,
                content:[]
            });

            this.chatUsers = this.msgService.getChatUsers();
            this.selectUserName = this.chatUsers[0].userName;
            if(func) func();
        });
    }

    //添加消息记录
    addContent(userName:string, msg:string, isLeft:boolean){
        let user = this.getUser(userName);
        if(!user){
            this.addUser(userName,() => {
                user = this.getUser(userName);
                user.content.push(new MsgItemModel(msg,isLeft));
            });
        }
    }

    //用户列表
    @ViewChild("userList")
    userList:ElementRef;
    //聊天面板
    @ViewChild("content")
    content:ElementRef;

    //视图子元素加载完毕钩子
    ngAfterViewInit(){
        this.activatedRoute.queryParams
        .subscribe((params:any) => {
            this.chatUsers = this.msgService.getChatUsers();
            if(this.chatUsers[0]){
                this.selectUserName = this.chatUsers[0].userName;
                //读取当前联系人的聊天记录
                console.log(this.chatUsers);
                let user = this.getUser(this.selectUserName);
                if(user) this.msgItemArr = user.content;  
            }
                      
            if(params.hasOwnProperty('userName')){
                //判断是否已经存在与此用户的聊天窗口
                console.log(this.chatUsers);
                if(this.chatUsers.length != 0){
                    let isExist = true;
                    for(let val of this.chatUsers){
                        //存在
                        if(params.userName == val.userName){
                            //跳转到指定用户聊天窗口
                            // this.linkTargetUserItem(params.userName);
                            isExist = false;
                        }
                    }
                    if(isExist) this.addUser(params.userName);
                }
                else{
                   this.addUser(params.userName);
                } 
            }
        })
        
        //获取消息
        this.msgService.getMsg()
        .subscribe((data:any) => {
            console.log(JSON.stringify(data));
            this.msgItemArr.push(new MsgItemModel(data.msg,true));    
            this.addContent(data.userName,data.msg,true);
        })
    }

    //初始化钩子
    ngOnInit(){
        

        //清空未读消息数目
        this.msgService.resetMsgCount();
    }

    ngAfterViewChecked(){
        
        // for(let val of this.chatUsers){
        //     console.log(val);
        // }
        // if(this.chatUsers[0]){
        //     this.selectUserName = this.chatUsers[0].userName;            
        // }
    }

    closePane(){
        this.router.navigate(['main']);
    }
    
    //发送消息
    sendMessage(msg:string){
        this.msgService.sendMsgToUser(this.selectUserName,msg);
        //创建气泡
        this.msgItemArr.push(new MsgItemModel(msg,false));
        console.log("dsasd");
        //添加消息记录
        this.addContent(this.selectUserName,msg,false);
    }

    //清空输入框
    clearInput(input:HTMLInputElement){
        input.value = '';
    }
}