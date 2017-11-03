import { User } from './../../../services/user.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

@Component({
    selector:'friend-list',
    templateUrl:"./friend-list.component.html",
    styleUrls:["./friend-list.component.css"]
})
export class FriendListComponent implements OnInit{
    //用于储存获得的好友列表
    friendList:Array<Object>;
    //是否显示好友列表
    isViewFriendList:boolean;
    //是否显示搜索好友框
    isViewSearchFriend:boolean = false;
    //无好友时标签信息
    pName:string = "暂无好友信息， 快去添加好友吧！";
    //输入框信息
    searchValue:string;

    constructor(
        private router:Router,
        private http:Http,
        private user:User
    ){
        //
    }

    //初始化钩子
    ngOnInit(){
        let targetUser = this.user.getUserInfo().user;
        //获取好友列表
        this.http.post("http://localhost:3000/getUser/" + targetUser,{})
        .subscribe((res:Response) => {
            let data = res.json().successful[0].friends;
            console.log(data);
            if(data.length == 0){
                this.isViewFriendList = false;
                this.friendList = [];
            }
            else{
                this.isViewFriendList = true;
                this.friendList = data;
            }
        });
    }

    //跳转至标签页
    back(){
        this.router.navigate(['main/tab']);
    }

    //显示搜索好友框
    viewSearchFriend(){
        this.isViewSearchFriend = true;
    }

    //隐藏搜索好友框
    hiddenSearchFriend(){
        this.ngOnInit();
        this.isViewSearchFriend = false;
    }

    //聊天点击按钮
    chatFriend(userName:string){
        //导航至联系面板
        this.router.navigate(['main/msg-pane'],{queryParams:{userName:userName}});
    }
}