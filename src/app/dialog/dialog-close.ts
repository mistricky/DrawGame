import { DialogModelSchema } from './../interfaces/dialog-schema.interface';
/**
 * 使用对话框的类继承该类实现隐藏对话框
 */

export class DialogClose{
    isDialogView:boolean = false;
    dialogModel:DialogModelSchema;

    //对话框队列
    dialogQueue:Array<DialogModelSchema> = [];

    constructor(){
    }

    //判断能否显示
    judgeViewDialog(){
        if(!this.isDialogView && this.dialogQueue.length != 0){
            this.dialogModel = this.dialogQueue.shift();
            // console.log(this.dialogModel);
            this.isDialogView = true;
        }
    }

    close(){
        this.isDialogView = false;
        //添加至事件队列尾
        setTimeout(() => {
            this.judgeViewDialog();  
        },10);  
    }

    showDialog(dialogModel:DialogModelSchema){
        // this.isDialogView = true;
        //添加进对话框队列
        this.dialogQueue.push(dialogModel);
        this.judgeViewDialog();
    }
}