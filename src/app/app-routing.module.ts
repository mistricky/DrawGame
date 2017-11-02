import { MsgPaneComponent } from './msgPane/msg-pane.component';
import { FriendGameExit } from './services/friend-game-exit.service';
import { FriendGame } from './friendGame/friend-game.component';
import { GamePaneComponent } from './gamePane/game-pane.component';
import { FriendListComponent } from './main/main-tab/friendList/friend-list.component';
import { TabComponent } from './main/main-tab/tab/tab.component';
import { User } from './services/user.service';
import { LoginAuthGuard } from './services/login-auth.service';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//配置路由
let routes:Routes = [
    {path:"",redirectTo:"entry",pathMatch:"full"},
    {path:"entry",component:IndexComponent},
    {path:"main",component:MainComponent,canActivate:[LoginAuthGuard],children:[
        //页面子路由
        {path:'',pathMatch:'full',redirectTo:'tab'},
        {path:"friendList",component:FriendListComponent},
        {path:"tab",component:TabComponent},
        {path:"game-pane",component:GamePaneComponent},
        {path:"friend-game",component:FriendGame,canDeactivate:[FriendGameExit]},
        {path:"msg-pane",component:MsgPaneComponent}
    ]},
    {path:"**",redirectTo:"entry"}
];

@NgModule({
    imports:[
        RouterModule.forRoot(routes)
    ],
    exports:[
        RouterModule
    ],
    providers:[
        User,
        LoginAuthGuard,
        FriendGameExit
    ]
})
export class AppRoutingModule{ }