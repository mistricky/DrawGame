import { User } from './user.service';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OrganizeService{
    //队长名
    first:string;

    constructor(private http:Http, private user:User){

    }

    //获取组队队长
    getOrganizeFirst(){
        return this.first;
    }
    //设置组队队长
    setOrganizeFirst(first:string){
        this.first = first;
    }

    //添加用户
    addUser(first:string, userName?:string):Observable<Object>{
        return this.http.post('http://localhost:3000/addOrganizeUser',{first:first,userName:userName});
    }

    //删除用户
    removeUser(first:string, userName:string):Observable<Object>{
        return this.http.post('http://localhost:3000/removeOrganizeUser',{first:first,userName:userName});
    }

    //获取队伍信息
    getInfo(first:string):Observable<Object>{
         return this.http.post('http://localhost:3000/getOrganizeInfo',{first:first});
    }
    
    exitOrganize(){
        //队长是否是自己
        if(this.getOrganizeFirst() == this.user.getUserInfo().user){
            //销毁队伍
            this.http.post("http://localhost:3000/dropOrganize",{first:this.user.getUserInfo().user})
            .subscribe(data => {
                console.log(data);
            });
            this.setOrganizeFirst(null);
        }
        else{
            console.log(this.getOrganizeFirst(),this.user.getUserInfo());
            this.http.post('http://localhost:3000/removeOrganizeUser',{first:this.getOrganizeFirst(),userName:this.user.getUserInfo().user})
            .subscribe(data => {
                console.log(data);
            });
            //从队伍中删除自己
            this.setOrganizeFirst(null);
            console.log("Exit");
        }
    }
}