import { Router } from '@angular/router';
import { DialogComponent } from './../dialog/dialog.component';
import { DialogClose } from './../dialog/dialog-close';
import { DialogModelSchema } from './../interfaces/dialog-schema.interface';
import { Observable } from 'rxjs/Observable';
import { ChatService } from './../services/chat.service';
import { Http, Response } from '@angular/http';
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, EventEmitter } from '@angular/core';

//颜色关联数组
let Color = {
    red:"#ff0000",
    orange:"#ff8c00",
    yellow:"#ffff00",
    olive : "#9acd32",
    green : "#32cd32",
    teal : "#7fffd4",
    blue : "#1e90ff",
    violet : "#8a2be2",
    purple : "#ba55d3",
    pink : "#ff00ff",
    brown : "#CD853F",
    grey : "#a9a9a9",
    black : "#000000"
}

//坐标接口
interface Pos{
    x:number;
    y:number;
}

//获取触摸x y坐标
function getPosition(e:TouchEvent,canvasDOM:HTMLCanvasElement){
    let touched = e.changedTouches;
    let x:number = touched[0].clientX - canvasDOM.offsetLeft;
    let y:number = touched[0].clientY - canvasDOM.offsetTop;
    return {x:x,y:y};
}

@Component({
    selector:"game-pane",
    templateUrl:"game-pane.component.html",
    styleUrls:["game-pane.component.css"]
})
export class GamePaneComponent extends DialogClose implements AfterViewInit,OnInit{
    //canvas DOM 对象
    canvasDOM:HTMLCanvasElement;
    //canvas2d DOM 对象
    canvas2dDOM:CanvasRenderingContext2D;
    //canvas elementRef
    @ViewChild("canvas")
    canvas:ElementRef;
    //content elementRef
    @ViewChild("content")
    content:ElementRef;

    //画图锁 是否能够画图
    drawLock:boolean = true;

    //当前线条颜色
    lineColor:string = "#000";

    //选择工具的标识位置
    toolSelectorLocation:number = 0;

    constructor(private chatService:ChatService,private http:Http,private router:Router){
        super();
    }

    //初始化钩子
    ngOnInit(){
        //开始游戏
        this.chatService.beginGame();

        //结束游戏
        this.chatService.gameOver()
        .subscribe(() => {
            console.log("游戏结束");
            //添加至事件队列尾部
            setTimeout(() => {
                this.showDialog({
                    title:"提示信息",
                    message:"游戏已经结束",
                    buttonIndex:1,
                    btn1:{title:"退出房间",func:() => {
                        this.router.navigate(['main']);
                        this.close();
                    },color:"red"}
                });
            },10);
        });

        //获取题目
        this.chatService.getQuestion()
        .subscribe((data:string) => {
            console.log(data);
            //显示对话框
            this.showDialog({
                title:"提示信息",
                message:`题目 : ${data}`,
                buttonIndex:1,
                btn1:{title:"确定",func:() => {
                    this.close();
                }}
            });
        });

        //接受服务器通知是否答对
        this.chatService.validAnswerResult()
        .subscribe((data:boolean) => {
            if(data){
                this.showDialog({
                    title:"提示信息",
                    message:"有一玩家已经答对",
                    buttonIndex:1,
                    btn1:{title:"我知道了",color:"green",func:() => {
                        this.close();
                    }}
                });
            }
        });

        //服务器通知可以绘画
        this.chatService.canDraw()
        .subscribe((data:boolean) => {
            console.log(data);
            this.drawLock = !data;
            //清空画布
            this.canvas2dDOM.clearRect(0,0,parseFloat(this.canvasDOM.getAttribute("width")),parseFloat(this.canvasDOM.getAttribute("height")));
        })
    }

    //子视图渲染完毕钩子
    ngAfterViewInit(){
        //获取canvas2d对象
        this.canvasDOM = this.canvas.nativeElement;
        this.canvas2dDOM = this.canvasDOM.getContext('2d');
        let canvas2dDOM = this.canvas2dDOM;
        //设置canvas宽高
        this.canvasDOM.setAttribute("width",window.getComputedStyle(this.content.nativeElement)["width"]);
        this.canvasDOM.setAttribute("height",window.getComputedStyle(this.content.nativeElement)["height"]);

        //设置线条样式
        this.canvas2dDOM.lineWidth = 2;
        this.canvas2dDOM.strokeStyle = "#000";
        
        //监听触摸事件
        this.canvasDOM.addEventListener("touchstart",e => {
            if(this.drawLock) return;
            this.canvas2dDOM.beginPath();
            // this.canvas2dDOM.clearRect(0,0,parseFloat(this.canvasDOM.getAttribute("width")),parseFloat(this.canvasDOM.getAttribute("height")));
            let posObj:Pos = getPosition(e,this.canvasDOM);
            this.canvas2dDOM.moveTo(posObj.x,posObj.y);
        });
        this.canvasDOM.addEventListener("touchmove",e => {
            if(this.drawLock) return;
            let posObj:Pos = getPosition(e,this.canvasDOM);
            this.canvas2dDOM.lineTo(posObj.x,posObj.y);
            this.canvas2dDOM.stroke();

            this.chatService.changeCanvas(this.canvasDOM.toDataURL());
        });
        this.canvasDOM.addEventListener("touchend",e => {
            this.canvas2dDOM.closePath();
        });

        //服务器通知更新canvas
        let updateCanvas:Observable<string> = this.chatService.getUpdateCanvas();
        let img:any = new Image();
        updateCanvas.subscribe((dataURL:string) => {
            img.src = dataURL;
            img.onload = function(){
                canvas2dDOM.drawImage(img,0,0);
                console.log("update canvas");
            }
        });
    }

    popAnswer(){
        this.showDialog({
            title:"提示信息",
            message:"",
            buttonIndex:1,
            btn1:{title:"确定",func:(data:string) => {
                console.log(data);
                this.chatService.validAnswer(data);
                //关闭对话框
                this.close();
            }},
            isInputView:true
        });
    }


    getInputValue(data:any){
        console.log(data);
    }

    //更改线条样式
    changeLine(event:any,target:string){
        console.log(event.target.tagName);
        let top:number;
        if(event.target.tagName == 'IMG') {
            //获取父元素的顶部高度
            top = event.target.parentNode.offsetTop;           
        }
        else{
            top = event.target.offsetTop;
        }
        this.toolSelectorLocation = top;
        switch(target){
            case "pencil":
                this.canvas2dDOM.lineWidth = 2;
                this.canvas2dDOM.strokeStyle = this.lineColor;
            break;
            case "eraser":
                this.canvas2dDOM.lineWidth = 20;
                this.canvas2dDOM.strokeStyle = "#fff";
            break;
            case "rainbow":
                var gradient = this.canvas2dDOM.createLinearGradient(0,0,parseFloat(this.canvasDOM.getAttribute("width")),0);
                gradient.addColorStop(0,Color.red);
                gradient.addColorStop(0.14,Color.orange);
                gradient.addColorStop(0.28,Color.yellow);
                gradient.addColorStop(0.42,Color.green);
                gradient.addColorStop(0.56,Color.violet);
                gradient.addColorStop(0.7,Color.blue);
                gradient.addColorStop(0.84,Color.purple);

                // 用渐变进行填充
                this.canvas2dDOM.lineWidth = 8;
                this.canvas2dDOM.strokeStyle = gradient;
            break;
            case "make":
                this.canvas2dDOM.lineWidth = 5;
                this.canvas2dDOM.strokeStyle = this.lineColor;
            break;
        }
    }

    //更改线条颜色
    changeColor(color:string){
        this.lineColor = Color[color];
        this.canvas2dDOM.strokeStyle = this.lineColor;
    }
}