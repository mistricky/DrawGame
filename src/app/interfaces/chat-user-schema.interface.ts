import { MsgItemModel } from './../models/msg-item.model';
export interface chatUser{
    userName:string;
    headImg:string;
    isLine:boolean;
    content:Array<MsgItemModel>;
}