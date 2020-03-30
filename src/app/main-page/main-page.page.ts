import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { HttpClient } from "@angular/common/http";
// import { url } from 'inspector';
import { map } from 'rxjs/operators';
// import { fstat } from 'fs';
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
  // model : tf.loadLayersModel;
  class : any;
  model : any;
  constructor(public http:HttpClient) { }

  ngOnInit() {
    this.loadMOdel()
    this.http.get('assets/classes.json').subscribe(data =>{ 
    this.class = data;
    console.log(this.class[0])
   });  
    // const image = document.querySelector("#img-content")
    // const t = tf.browser.fromPixels(image)
  }

  start()
  {
    const im = new Image()
    im.src = "assets/images/shark.jpeg"
    im.onload = () => {
              var a = tf.browser.fromPixels(im, 3).resizeBilinear([224,224])
              // a.print()
              console.log(a.shape)
              a = tf.div(a,255.)
              a = a.reshape([1,224,224,3]) as any
              var pred = this.model.predict([a])
              console.log(pred.shape)
              // const pred_class = tf.argMax(pred) as any
              console.log(pred[0].argMax(1).shape)
              console.log(this.class[pred.argMax()])
              console.log(a.print())
            }
  }


  async loadMOdel()
  {
    // tf.browser.
    this.model = await tf.loadLayersModel('/assets/model/model.json');
    this.model.summary()
    // return model;
  }

}
