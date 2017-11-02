import { OrganizeService } from './organize.service';
import { User } from './user.service';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
const io = require('socket.io-client');

/**
 * 用于与服务器建立websocket连接的service
 */

@Injectable()
export class ChatService{
    private location:string = "http://localhost:3000";
    //Socket对象
    private socket:any;
    //房间号
    private roomID:number;

    constructor(private user:User, private organize:OrganizeService){
    
    }

    //建立websocket连接
    connect(connection?:Function, disconnect?:Function){
        this.socket = io.connect(this.location);
        console.log(this.socket);
        //连接回调
        this.socket.on("connection",() => {
            if(connection) connection(this.socket);
            this.socket.emit("changeLine",{user:this.user.getUserInfo().user,isLine:true});
        })
        //更新用户在线信息
        console.log(`发送的用户名 ${this.user.getUserInfo().user}`);
    }

    //断开连接
    disconnect(){
        //断开连接
        console.log(this.socket);
        if(this.socket){
            //更新用户在线信息
            this.socket.emit("changeLine",{user:this.user.getUserInfo().user,isLine:false});
            //主动断开连接
            this.socket.disconnect();
            //等待GC回收
            this.socket = null;            
        }
    }

    //参与匹配
    match(user:Array<string>){
        this.socket.emit("match",{users:user});
    }

    //获取socket对象
    getSocket(){
        return this.socket;
    }

    //匹配成功
    matchSuccessful(){
        return new Observable<boolean>(observer => {
            this.socket.once("matchSuccessful",roomID => {
                this.roomID = roomID;
                observer.next(true);
            });
        });
    }

    //通知服务器更改图片
    changeCanvas(dataURL:string){
        this.socket.emit("changeCanvas",{dataURL:dataURL,roomID:this.roomID});
    }

    //接收服务器更新通知
    getUpdateCanvas(){
        //更新Canvas成功
        return new Observable<string>(observer => {
            this.socket.on("changeCanvasSuccessful",(dataURL:string) => {
                observer.next(dataURL);
            });
        });
    }

    //获取问题
    getQuestion(){
        return new Observable<string>(observer => {
            this.socket.on("getQuestion",(data:string) => {
                observer.next(data);
            })
        });
    }

    //验证答案是否正确
    validAnswer(answer:string){
        this.socket.emit("validAnswer",{answer:answer,roomID:this.roomID});
    }

    //接收验证答案结果
    validAnswerResult(){
        return new Observable<boolean>(observer => {
            this.socket.on("validAnswerResult",(data:boolean) => {
                observer.next(data);
            })
        })
    }

    //服务器通知可以绘图
    canDraw(){
        return new Observable(observer => {
            this.socket.on("canDraw",(data:boolean) => {
                observer.next(data);
            })
        })
    }

    //通知服务器游戏开始
    beginGame(){
        this.socket.emit("beginGame",{roomID:this.roomID});
    }

    //服务器通知游戏结束
    gameOver(){
        return new Observable(observer => {
            this.socket.on("gameOver",() => {
                observer.next();
            })
        });
    }

    //服务器通知更新好友列表状态信息
    updateFriendList(){
        return new Observable(observer => {
            this.socket.on("updateFriendList",() => {
                observer.next();
            });
        });
    }

    //服务器通知清空画布
    clearCanvas(){
        return new Observable(observer => {
            this.socket.on("clearCanvas",() => {
                observer.next();
            })
        })
    }

    //发送组队邀请好友
    sendRequestToFriend(user:string){
        this.socket.emit("sendRequestToFriend",{user:this.user.getUserInfo().user,targetUser:user,first:this.organize.getOrganizeFirst()});
    }

    //接收用户请求
    getRequest(){
        return new Observable(observer => {
            this.socket.on("getRequest",(data:{user:string,first:string}) => {
                observer.next(data);
            })
        });
    }

    //服务器通知更新队伍信息
    updateInfo(){
        return new Observable(observer => {
            this.socket.on("updateInfo",() => {
                observer.next();
            })
        });
    }
}