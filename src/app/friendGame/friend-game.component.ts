import { OrganizeService } from './../services/organize.service';
import { Http, Response } from '@angular/http';
import { DialogClose } from './../dialog/dialog-close';
import { ChatService } from './../services/chat.service';
import { User } from './../services/user.service';
import { LiteFriendList } from './../liteFriendList/lite-friend-list.component';
import { FriendInfoComponent } from './../main/main-tab/friendList/friendInfo/friend-info.component';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//用户信息
interface UserInfo{
    headImg?:string;
    userName:string
}

@Component({
    selector:"friend-game",
    templateUrl:"./friend-game.component.html",
    styleUrls:["./friend-game.component.css"]
})
export class FriendGame extends DialogClose implements OnInit,AfterViewInit,OnDestroy{
    //组队用户信息
    userInfo:Array<UserInfo> = [];    
    //用户名数组
    userNameInfo:Array<string>;
    //用户默认头像
    headImgPath:string = "../../assets/imgs/headImg.jpg";
    //当前用户人数
    userIndex:number = 0;
    //服务器通知更新的订阅对象数组
    subScription:Array<any> = [];

    constructor(
        private router:Router, private user:User, 
        private chatService:ChatService, 
        private activatedRoute:ActivatedRoute,
        private http:Http,
        private organize:OrganizeService
    ){
        super();
        //初始化用户数组
        for(let i = 0;i < 5;i++){
            this.userInfo.push({userName:null,headImg:''});
        }

        //获取参数
        activatedRoute.queryParams.subscribe((data:any) => {
            //如果没有参数表示要新建一个队伍
            if(data.hasOwnProperty("first")){
                //更新队长
                this.organize.setOrganizeFirst(data.first);
                //加入队伍
                this.organize.addUser(data.first, this.user.getUserInfo().user)
                .subscribe(data => console.log(data));
            }
            else{
                //更新队长
                this.organize.setOrganizeFirst(this.user.getUserInfo().user);
                //创建队伍
                this.organize.addUser(this.user.getUserInfo().user)
                .subscribe(data => console.log(data));
            }
        });
    }  

    //发送请求给好友
    sendRequestToFriend(data:string){
        this.chatService.sendRequestToFriend(data);
    }

    //初始化钩子
    ngOnInit(){
        this.subScription.push(this.chatService.updateInfo()
        .subscribe(() => {
            this.organize.getInfo(this.organize.getOrganizeFirst())
            .subscribe((res:Response) => {
                let data = res.json().successful;
                let arr = [];
                arr.push({userName:data.first,headImg:this.headImgPath});
                for(let val of data.users){
                    arr.push({userName:val,headImg:this.headImgPath});
                }           
                let temp = 5 - arr.length;
                //补全数据
                for(let i = 0;i < temp;i++){
                    arr.push({userName:'',headImg:''});
                }
                
                let userNameInfo = data.users;
                userNameInfo.push(data.first);
                this.userNameInfo = userNameInfo;

                this.userInfo = arr;
            })
        }));

        this.subScription.push(this.chatService.matchSuccessful()
        .subscribe(data => {
            if(data){
                //关闭对话框
                this.close();
                //匹配成功后打开主页面
                console.log("匹配成功");
                this.router.navigate(['main/game-pane']);
            }
        }));
    }

    close(){
        this.router.navigate(['main']);
    }

    ngAfterViewInit(){
        
    }
    ngOnDestroy(){
        //取消订阅
        for(let val of this.subScription){
            val.unsubscribe();
        }

        this.organize.exitOrganize();
    }

    //配置dialogmodel
    dialogInit(){
        this.showDialog({
            title:"提示信息",
            message:"匹配中...",
            buttonIndex:0,
            isViewImg:true
        });
    }

    //匹配
    match(){
        this.dialogInit();
        console.log(this.userNameInfo);
        this.chatService.match(this.userNameInfo);
    }
}