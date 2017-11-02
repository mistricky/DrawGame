import { User } from './../services/user.service';
import { Component, OnInit, Output, Input, EventEmitter, DoCheck, ChangeDetectionStrategy, OnChanges, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';

/**
 * 注册登录表单
 */

@Component({
  selector: 'app-entry-box',
  templateUrl: './entry-box.component.html',
  styleUrls: ['./entry-box.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[
    {provide:"REGISTE_SUBMIT", useValue:"http://localhost:3000/registe"},
    {provide:"LOGIN_SUBMIT", useValue:"http://localhost:3000/login"}
  ]
})
export class EntryBoxComponent implements OnInit,OnChanges{
  myForm:FormGroup;
  userCtrl:AbstractControl;
  passwCtrl:AbstractControl;


  //提交按钮名称
  @Input()
  btnName:string;

  //注册登录url
  REGISTE_SUBMIT:string;
  LOGIN_SUBMIT:string;

  //表单提交action  
  action:string = "#";

  constructor(
    fb:FormBuilder,
    @Inject("REGISTE_SUBMIT") REGISTE_SUBMIT:string,
    @Inject("LOGIN_SUBMIT") LOGIN_SUBMIT:string,
    //注入user service
    private user:User,
    private http:Http,
    private router:Router
  ) {
    this.myForm = fb.group({
      'user':['',Validators.required],
      'passw':['',Validators.required]
    });

    this.REGISTE_SUBMIT = REGISTE_SUBMIT;
    this.LOGIN_SUBMIT = LOGIN_SUBMIT;
  }

  //调用初始化钩子
  ngOnInit() {
    this.userCtrl = this.myForm.controls['user'];
    this.passwCtrl = this.myForm.controls['passw'];
  }

  @Output()
  emitHiddenEntry:EventEmitter<String> = new EventEmitter<String>();

  //通知父组件隐藏自己
  hiddenEntryBox(){
    this.emitHiddenEntry.emit();
  }

  //提交表单钩子
  onSubmit(formValue:any){
    let userValid = this.userCtrl.valid;
    let passwValid = this.passwCtrl.valid;

    if(!userValid || !passwValid){
      alert("账号密码输入有误");
      return;
    }

    //ajax
    this.http.post(this.action, formValue)
      .subscribe((res:Response) => {
        if(res.json().err){
          alert(res.json().err);
        }
        else if(this.action = this.LOGIN_SUBMIT){
          //写入用户类
          this.user.login(formValue.user);
          //跳转至主页面
          this.router.navigate(['main']);
        }
      })
  }

  //脏值检查钩子
  ngOnChanges(){
    if(this.btnName == "注册"){
      //更改提交action的值
      this.action = this.REGISTE_SUBMIT;
    }
    else {
      this.action = this.LOGIN_SUBMIT;
    }    
  }
}
