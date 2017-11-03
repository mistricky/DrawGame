export class MsgItemModel{
    private msg:string;
    private isLeft:boolean;

    constructor(msg:string,isLeft:boolean){
        this.msg = msg;
        this.isLeft = isLeft;
    }

    getMsg():string{
        return this.msg;
    }
    setMsg(msg:string){
        this.msg = msg;
    }

    getIsLeft():boolean{
        return this.isLeft;        
    }
    setIsLeft(isLeft:boolean){
        this.isLeft = isLeft;
    }
}