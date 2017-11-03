import { User } from './user.service';
import { MsgItemModel } from './../models/msg-item.model';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs/Observable';
import { chatUser } from './../interfaces/chat-user-schema.interface';
import { Http, Response } from '@angular/http';
import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class MsgService{

    constructor(private http:Http, private chatService:ChatService, private user:User){

    }

    //未读消息数量
    private msgCount:number = 0;
    //用户数据模型数组
    private chatUsers:Array<chatUser> = [];
    //头像路径
    private headImgPath:"../../assets/imgs/headImg.jpg";
    //接收到的消息缓存数组
    private msgCache:Array<MsgItemModel> = [];
    //事件发射器
    private eventBus:EventEmitter<number> = new EventEmitter<number>();

    //设置未读消息数量
    setMsgCount(){
        this.msgCount++;
        //通知视图更新纬度消息数量
        this.eventBus.emit(this.msgCount);
    }

    //重置未读消息数量
    resetMsgCount(){
        this.msgCount = 0;
        //通知视图更新纬度消息数量
        this.eventBus.emit(this.msgCount);
    }

    //添加用户
    addUser(userName:string):Observable<Response>{
        return this.http.post("http://localhost:3000/getUser/" + userName,{});
    }

    //添加用户至数组
    addUserToArray(user:chatUser){
        this.chatUsers.push(user);
    }
    
    //删除用户
    removeUser(userName:string){
        for(let val of this.chatUsers){
            if(userName == val.userName){
                this.chatUsers.splice(this.chatUsers.indexOf(val),1);
            }
        }
    }

    //获取用户数据模型数组
    getChatUsers():Array<chatUser>{
        return this.chatUsers;
    }

    //获取头像路径
    getHeadImgPath():string{
        return this.headImgPath;
    }

    //发送消息给指定用户
    sendMsgToUser(user:string,msg:string){
        this.chatService.getSocket().send({targetUser:user,msg:msg,userName:this.user.getUserInfo().user});        
    }

    //接收消息
    getMsg():Observable<any>{
        return new Observable(observer => {
            this.chatService.getSocket().on("message",data => {
                observer.next(data);
            });
        });
    }

    //添加消息进消息缓存
    addMsgCache(msg:string){
        this.msgCache.push(new MsgItemModel(msg,true));
    }
    //清空消息缓存
    clearMsgCache(){
        this.msgCache = [];
    }

    getMsgCount():Observable<number>{
        return this.eventBus;
    }
}