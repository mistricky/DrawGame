import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

/**
 * 用户登录服务
 */

@Injectable()
export class User{
    //用户名
    private user:string;
    //是否登录状态
    private isLogin:boolean;
    //当前用户状态
    private state:string = "空闲";
    //用户未读消息数量
    private msgCount:number = 0;

    constructor(private http:Http){

    }

    //登录成功
    login(user:string):void{
        this.user = user;
        this.isLogin = true;
    }

    //登出
    loginOut():void{
        this.user = null;
        this.isLogin = false;
    }

    //获取登录状态
    getLoginState():boolean{
        return this.isLogin;
    }

    //写入Storage
    writeStorage():void{
        localStorage.setItem("user",this.user);
    }

    //删除Storage
    removeStorage():void{
       localStorage.removeItem("user");
    }

    //获取用户信息
    public getUserInfo():any{
        return {'user':this.user};
    }

    //设置用户状态
    setState(state:string){
        this.state = state;
    }
    //获取用户状态
    getState(state:string){
        return this.state;
    }

    //获取用户未读消息数目
    getMsgCount(){
        return this.msgCount;
    }
    //增加用户未读消息数目
    addMsgCount(){
        this.msgCount++;
    }

    //获取好友列表数组
    getFriendList():Observable<Array<Object>>{
        return new Observable<any>(observer => {
            return this.http.post('http://localhost:3000/getUser/' + this.user,{})
            .subscribe((res:Response) => {
                let data = res.json().successful[0];
                this.http.post("http://localhost:3000/getFriendList",{friendList:data.friends})
                .subscribe((res:Response) => {
                    let data = res.json()
                    observer.next(data.successful);
                })
            });
        })
    }
}   