import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector:"main-tab",
    templateUrl:"./main-tab.component.html",
    styleUrls:['./main-tab.component.css']
})
export class MainTabComponent implements OnInit, AfterViewInit{
    //组件高度
    height:number;

    constructor() {}
    
    ngOnInit(): void {
        
    }

    @ViewChild('mainContainer')
    mianContainer:ElementRef;

    //将px单位字符串转换为float
    private floatFormat(value:string):number{
        return parseFloat(value.split('p')[0]);
    }

    ngAfterViewInit(){
        //获取顶层字体大小
        let fontSize:number = this.floatFormat(window.getComputedStyle(document.documentElement)["fontSize"]);
        //获取headerBar高度
        let headerBarHeight:number = fontSize * 3.2;
        //设置MainContainer的高度
        let mainContainerHeight:number = this.floatFormat(window.getComputedStyle(this.mianContainer.nativeElement)["height"]);
        this.height = mainContainerHeight - headerBarHeight;
        console.log(this.height);
    }
}