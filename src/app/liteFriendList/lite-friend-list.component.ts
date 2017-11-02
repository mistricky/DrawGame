import { User } from './../services/user.service';
import { Http, Response } from '@angular/http';
import { ChatService } from './../services/chat.service';
import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector:"lite-friend-list",
    templateUrl:"./lite-friend-list.component.html",
    styleUrls:["lite-friend-list.component.css"]
})
export class LiteFriendList implements OnInit,AfterViewInit{
    friendList:Array<Object>;

    constructor(private http:Http,private user:User,private chatService:ChatService){
        
    }

    ngOnInit(){
        
    }

    ngAfterViewInit(){
        this.user.getFriendList()
        .subscribe(data => {
            this.friendList = data;
        });
    }

    @Output()
    sendRequestToFriend:EventEmitter<string> = new EventEmitter<string>();

    //发送请求
    sendRequest(data:string){
        this.sendRequestToFriend.emit(data);
    }
}