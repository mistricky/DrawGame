export interface DialogModelSchema{
    //对话框标题
    title:string;
    //对话框内容
    message:string;
    //对话框按钮
    buttonIndex:number;
    //按钮
    btn1?:{title:string,func?:Function,color?:string},
    btn2?:{title:string,func?:Function,color?:string},
    btn3?:{title:string,func?:Function,color?:string},
    //是否显示加载图片
    isViewImg?:boolean;
    isInputView?:boolean;
}