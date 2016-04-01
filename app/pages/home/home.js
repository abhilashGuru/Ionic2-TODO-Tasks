import {Page, Modal, NavController, NavParams, ViewController, Alert, ActionSheet} from 'ionic-angular';
import {DBService} from '../../service/dbservice';

@Page({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {
    
    static get parameters(){
        return[ [NavController], [DBService] ];
    }
    
    constructor(nav, dbservice){
        this.nav = nav;
        this.dbservice = dbservice;
        this.tasks=[];
        
        this.showTask();
    }
    
    showTask(){
        this.dbservice.getTasks().then((data) => {
            this.tasks = [];
            if(data.res.rows.length > 0){
                for(var i = 0; i < data.res.rows.length; i++){
                    this.tasks.push({id: data.res.rows.item(i).id, task: data.res.rows.item(i).task, priority: data.res.rows.item(i).priority, status: data.res.rows.item(i).status});
                }
            }
        });
    }
    
    delTask(id){
        this.nav.present(ActionSheet.create({
            title: 'Remove task',
            buttons:[
                {
                    text: 'Delete',
                    style: 'destructive',
                    handler:() => {
                        this.dbservice.delTask(id).then(() => {
                            this.nav.present(Alert.create({
                                title: 'Success',
                                subTitle: 'Task Removed',
                                buttons: [{
                                    text: 'OK',
                                    handler:() => {
                                        this.showTask();
                                    }
                                }]
                            }));
                        });
                    }
                },{
                    text: 'Cancel',
                    style: 'cancel',
                    handler: () => {
                        console.log('cancle clicked');
                    }
                }
            ]
        }));
    }
    
    doneTask(id, status){
        this.dbservice.doneTask(id, status).then((data) => {
            this.nav.present(Alert.create({
                title: 'Success',
                subTitle: 'Task status updated',
                buttons: [{
                    text: 'OK',
                    handler:() => {
                        this.showTask();
                    }
                }]
            }));
        });
    }
    
    showModal(id){
        let modal = Modal.create(MyModal, {taskId: id});
        modal.onDismiss(data =>{
            this.showTask();
        })
        this.nav.present(modal);
    }
}

@Page({
    templateUrl: 'build/pages/home/modal.html'
})

class MyModal{
    
    static get parameters(){
        return [ [NavController], [NavParams], [ViewController], [DBService] ];
    }
    
    constructor(nav, params, viewCtrl, dbservice){
        this.nav = nav;
        this.dbservice = dbservice;
        this.viewCtrl = viewCtrl;
        this.tasks = [];
        
        this.taskid = params.get('taskId');
        
        if(this.taskid !== undefined){
            this.label = "Edit";
            this.dbservice.getTasks(this.taskid).then((data) => {
                this.task = data.res.rows.item(0).task;
                this.priority = data.res.rows.item(0).priority;
            });
        }else{
            this.label = "Add New ";
            this.priority = "normal";
        }
    }
    
    saveTask(){
        if(this.task === undefined){
            this.nav.present(Alert.create({
                title: 'Warning',
                subTitle: 'Please enter task',
                buttons: ["OK"]
            }));
        }else{
            let newItem = {
                task: this.task,
                priority: this.priority
            };
            
            this.dbservice.saveTask(this.taskid, newItem).then((data)=>{
                
                if(this.taskid === undefined){
                    var msg = "Task added";
                }else{
                    var msg = "Task updated";
                }
                console.log(msg);
                this.nav.present(Alert.create({
                    title: 'Success',
                    subTitle: msg,
                    buttons: [{
                        text: 'OK',
                        handler:() =>{
                            this.close();
                        }
                    }]
                }));
            });
        }
    }
    
    close(){
        this.viewCtrl.dismiss();
    }
}
