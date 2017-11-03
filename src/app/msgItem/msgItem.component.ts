import { Component, Input } from '@angular/core';

@Component({
    selector:"msg-item",
    templateUrl:"./msgItem.component.html",
    styleUrls:['./msgItem.component.css']
})
export class MsgItemComponent{
    @Input()
    isLeft:boolean;
    @Input()
    msg:string;
}