import { OrganizeService } from './organize.service';
import { User } from './user.service';
import { Http } from '@angular/http';
import { FriendGame } from './../friendGame/friend-game.component';
import { Injectable } from '@angular/core';
import { CanDeactivate } from "@angular/router";

@Injectable()
export class FriendGameExit implements CanDeactivate<FriendGame> {
    constructor(private http:Http, private user:User, private organize:OrganizeService){

    }

    canDeactivate(component: FriendGame): boolean{
        
        return true;
    }
}