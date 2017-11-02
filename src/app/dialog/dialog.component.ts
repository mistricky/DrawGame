import { DialogModelSchema } from './../interfaces/dialog-schema.interface';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector:"app-dialog",
    templateUrl:"./dialog.component.html",
    styleUrls:["./dialog.component.css"]
})
export class DialogComponent implements OnInit,AfterViewInit{
    @Input()
    dialogModel:DialogModelSchema;
    //图片旋转角度
    degIndex:number = 0;
    //旋转速率
    rotateSpeed:number = 50;
    //控制旋转计时器ID
    rotateID:any;

    btn1IsView:boolean = false;
    btn2IsView:boolean = false;
    btn3IsView:boolean = false;

    constructor(){
    }

    @Output()
    close:EventEmitter<String> = new EventEmitter<String>();

    //默认按钮点击事件
    closed(){
        this.close.emit();
    }

    //初始化钩子
    ngOnInit(){
        switch(this.dialogModel.buttonIndex){
            case 1:
                this.btn1IsView = true;
                break;
            case 2:
                this.btn2IsView = true;
                this.btn1IsView = true;
                break;
            case 3:
                this.btn3IsView = true;
                this.btn2IsView = true;
                this.btn1IsView = true;
                break;
        }
    }
    
    @ViewChild('loading')
    loading:ElementRef;
    //开启旋转动画
    startRotate(){
        //获取图片DOM
        let loadingEle = this.loading.nativeElement;
        this.rotateID = setInterval(() => {
            this.degIndex += 10;
            if(this.degIndex == 360){
                this.degIndex = 0;
            }
            loadingEle.style.transform = `rotate(${this.degIndex}deg)`;
        },this.rotateSpeed);
    }
    //停止旋转动画
    stopRotate(){
        if(this.rotateID) clearInterval(this.rotateID);
    }

    answerContent:string;
    ngAfterViewInit(){
        if(this.dialogModel.isViewImg){
            this.startRotate();            
        }
    }
}