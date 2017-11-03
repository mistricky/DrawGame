import { MsgItemComponent } from './msgItem/msgItem.component';
import { MsgService } from './services/msg.service';
import { MsgPaneComponent } from './msgPane/msg-pane.component';
import { OrganizeService } from './services/organize.service';
import { LiteFriendList } from './liteFriendList/lite-friend-list.component';
import { FriendGame } from './friendGame/friend-game.component';
import { GamePaneComponent } from './gamePane/game-pane.component';
import { ChatService } from './services/chat.service';
import { DialogComponent } from './dialog/dialog.component';
import { FriendInfoComponent } from './main/main-tab/friendList/friendInfo/friend-info.component';
import { SearchFriendComponent } from './main/main-tab/friendList/searchFriend/search-friend.component';
import { FriendListComponent } from './main/main-tab/friendList/friend-list.component';
import { TabComponent } from './main/main-tab/tab/tab.component';
import { MainTabComponent } from './main/main-tab/main-tab.component';
import { User } from './services/user.service';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { EntryBoxComponent } from './entry-box/entry-box.component';
import { IndexComponent } from './index/index.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderBarComponent } from './main/header-bar/header-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    EntryBoxComponent,
    MainComponent,
    HeaderBarComponent,
    MainTabComponent,
    TabComponent,
    FriendListComponent,
    SearchFriendComponent,
    FriendInfoComponent,
    DialogComponent,
    GamePaneComponent,
    FriendGame,
    LiteFriendList,
    MsgPaneComponent,
    MsgItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    {provide:User,useClass:User},
    {provide:ChatService,useClass:ChatService},
    {provide:OrganizeService,useClass:OrganizeService},
    {provide:MsgService,useClass:MsgService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
