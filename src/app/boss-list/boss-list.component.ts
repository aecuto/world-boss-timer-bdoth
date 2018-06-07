import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs';
import { DELEGATE_CTOR } from '@angular/core/src/reflection/reflection_capabilities';

@Component({
  selector: 'boss-list',
  templateUrl: './boss-list.component.html',
  styleUrls: ['./boss-list.component.css']
})

export class BossListComponent implements OnInit {

  constructor(private db: AngularFireDatabase) { }

  listBoss = [];
  isLoading = true;

  bossTimer(bosstime,bossday){

    //for boss
    var curr_day=new Date().getDay();
    var boss_time = bosstime*60*60;
    if(bossday > curr_day){
      boss_time += (bossday-curr_day)*24*60*60;
    }
  
    //curent
    var hour=new Date().getHours();
    var min= new Date().getMinutes();
    var sec= new Date().getSeconds();
  
    var current_time = (hour*60*60) + (min*60) + sec;
  
    return boss_time-current_time;
  }

  findBossNextSpawn(data){
    var curr_day=new Date().getDay();
    var hour=new Date().getHours();

  
    for(var i=0;i<5;i++){
      for (var key in data) {
        //console.log(key);
        if(data[key].day==curr_day+i){
          //console.log(i + ": " + data[key].name + ' |DAY: ' + data[key].day+ ' |TIME: ' + data[key].time);
          if(i==0 && hour < data[key].time){
            this.listBoss.push({
              name: data[key].name,
              time: data[key].time,
              day: data[key].day
            });
          }
          
          if(i!=0){
            this.listBoss.push({
              name: data[key].name,
              time: data[key].time,
              day: data[key].day
            });
          }
        }
  
        if(this.listBoss.length == 5){
          break;
        }
      }
    }
  
  };

  ngOnInit() {
    this.getBoss('/world_boss').subscribe(
      (response) => {
        this.findBossNextSpawn(response);
        this.isLoading = response.some(x => x.time == 0) ? false : true;
      }
    );


  }

  getBoss(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

}
