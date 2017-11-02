import { ChatService } from './../../../../services/chat.service';
import { User } from './../../../../services/user.service';
import { Component, Input, AfterViewInit, OnInit, OnChanges } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
    selector:"friend-info",
    templateUrl:"./friend-info.component.html",
    styleUrls:["./friend-info.component.css"]
})
export class FriendInfoComponent implements AfterViewInit,OnInit,OnChanges{
    @Input()
    isViewFriendList:boolean;
    @Input()
    friendList:Array<Object>;
    @Input()
    btnName:string;
    @Input()
    pName:string;
    @Input()
    btnClick:Function;
    @Input()
    searchName:string;

    constructor(private http:Http, private user:User, private chatService:ChatService){
        
    }

    //查询好友列表
    queryFriendList(){
        this.http.post("http://localhost:3000/getFriendList",{friendList:this.friendList})
        .subscribe((res:Response) => {
            let data = res.json().successful;
            this.friendList = data;
            console.log(data);
        });
    }

    ngOnChanges(){
        this.queryFriendList();
    }

    ngOnInit(){
        //服务器通知更新好友列表
        this.chatService.updateFriendList()
        .subscribe(() => {
            this.queryFriendList();
        });
    }

    ngAfterViewInit(){
        console.log(this.isViewFriendList);
    }
}