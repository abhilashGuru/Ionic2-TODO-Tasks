import {Storage, SqlStorage} from 'ionic-angular';
import {Injectable} from 'angular2/core';

@Injectable()
export class DBService{
    
    constructor(){
        this.storage = new Storage(SqlStorage);
        this.storage.query('create table if not exists tbltask (id integer primary key autoincrement, task text, priority text, status text)');
    }

    getTasks(id){
        if (id === undefined){
            return this.storage.query("select * from tbltask");
        }else{
            return this.storage.query("select * from tbltask where id = " + id);
        }
        
    }
    
    saveTask(id, item){
        if(id === undefined){
            return this.storage.query("insert into tbltask (task, priority, status) values ('" + item.task + "', '" + item.priority + "', 'pending')");
        }else{
            return this.storage.query("update tbltask set task = '" + item.task + "', priority = '" + item.priority + "' where id =" + id);
        }
        
    }
    
    delTask(id){
        return this.storage.query("delete from tbltask where id =" + id);
    }
    
    doneTask(id, status){
        if(status == 'pending'){
            status = 'done';
        }else{
            status = 'pending';
        }
        return this.storage.query("update tbltask set status = '" + status + "' where id =" + id);
    }
}
