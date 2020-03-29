import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { HttpClient } from "@angular/common/http";
// import { url } from 'inspector';
import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.page.html',
  styleUrls: ['./main-page.page.scss'],
})
export class MainPagePage implements OnInit {
  
  linearModel : tf.Sequential;
  prediction : any;
  InputTaken : any;
  // model : tf.Model;
  // model = tf.loadLayersModel;
  class : any;
  constructor(public http:HttpClient) { }

  ngOnInit() {
    var model = this.loadMOdel()
    this.http.get('assets/classes.json').subscribe(data =>{ 
    this.class = data;
    console.log(this.class[0])
        });  


  }


  async loadMOdel()
  {
    var model = await tf.loadLayersModel('/assets/model/model.json');
    return model;
  }

}
