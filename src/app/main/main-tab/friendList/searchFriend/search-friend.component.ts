import { User } from './../../../../services/user.service';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
    selector:"search-friend",
    templateUrl:"./search-friend.component.html",
    styleUrls:["search-friend.component.css"]
})
export class SearchFriendComponent implements OnInit{
    constructor(private http:Http, private user:User){}

    //是否查询到好友
    isViewFriendList:boolean = false;
    //没查询到好友显示信息
    pName:string = "没有查询结果";
    //查询到的数据
    friendList:Array<Object>;
    //需要查询的用户名
    @Input()
    searchName:string;
    @Output()
    hiddenSearchFriend:EventEmitter<String> = new EventEmitter<String>();

    //添加好友按钮点击
    addFriend(){
        console.log({user:this.user.getUserInfo().user,targetUser:this.searchName});
        this.http.post("http://localhost:3000/addFriend",{user:this.user.getUserInfo().user,targetUser:this.searchName})
        .subscribe((res:Response) => {
            let data = res.json();
            if(data.successful){
                alert("添加成功");
            }
            else{
                alert("该用户已经被添加过了哦");
            }
        });
    }

    //通知父组件隐藏自己
    close(){
        this.hiddenSearchFriend.emit();
    }

    //组件初始化钩子
    ngOnInit(){
        //查询用户
        console.log(`提交的数据 ${this.searchName}`);
        if(this.searchName == "" || !this.searchName){
            this.isViewFriendList = false;
            return;
        }
        else if(this.searchName == this.user.getUserInfo().user){
            this.pName = "不能查询自己哦";
            return;
        }
        //查询
        this.http.post("http://localhost:3000/getUser/" + this.searchName,{})
        .subscribe((res:Response) => {
            let data = res.json();
            //未找到用户
            if(data.err){
                this.isViewFriendList = false;
            }
            //找到用户
            else{
                this.friendList = data.successful;
                this.isViewFriendList = true;
            }
        });
    }
}