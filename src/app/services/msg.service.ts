

import { Injectable } from "@angular/core";

@Injectable()
export class MsgService{
    //未读消息数量
    private msgCount:number = 0;

    //设置未读消息数量
    setMsgCount(){
        this.msgCount++;
    }

    //重置未读消息数量
    resetMsgCount(){
        this.msgCount = 0;
    }
}