import { Injectable } from '@angular/core';
import { User } from './user.service';
import { CanActivate } from "@angular/router";
import { Router } from '@angular/router';

/**
 * 登录路由守卫
 */

@Injectable()
export class LoginAuthGuard implements CanActivate{
    constructor(private user: User, private router:Router) {}

    canActivate():boolean{
        if(this.user.getLoginState()){
            return true;
        }
        else{
            this.router.navigate(['entry']);
            return this.user.getLoginState();
        }
    }
}