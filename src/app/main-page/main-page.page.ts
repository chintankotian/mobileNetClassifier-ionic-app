import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { HttpClient } from "@angular/common/http";
// import { url } from 'inspector';
import { map } from 'rxjs/operators';
import { Camera,CameraOptions } from "@ionic-native/camera/ngx";
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
  options : any
  pred_class_string : any;
  src : any;
  private win: any = window;
    
  constructor(
    public http:HttpClient,
    private camera : Camera
    ) {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 224,
        targetHeight: 224
      }
      this.options = options;
     }

  ngOnInit() {
    this.loadMOdel()
    this.http.get('assets/classes.json').subscribe(data =>{ 
    this.class = data;
    console.log(this.class[0])
   });  
    // const image = document.querySelector("#img-content")
    // const t = tf.browser.fromPixels(image)
  }
  

  take_pic()
  {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.src = this.win.Ionic.WebView.convertFileSrc(imageData);
      console.log("captured image data -"+imageData)
      this.predict()
    }, (err) => {
      // Handle error
    }); 
  }
  async predict()
  {
    const im = new Image()
    im.src = this.src
    console.log('inside predict')
    im.onload = () => {
      const pred = tf.tidy(() => {
              console.log('inside image on load')
              console.log(im)
              var a = tf.browser.fromPixels(im, 3).resizeBilinear([224,224])
              console.log('test1')
              a = tf.div(a,255.)
              console.log('test2')
              var input_4d = a.reshape([1,224,224,3])
              console.log('test3')
              // var input_4d = tf.tensor4d(a.dataSync())
              var pred = this.model.predictOnBatch(input_4d)
              console.log('test4')
              var pred_class = Array.from(pred.argMax(1).dataSync())
              console.log('test5')
              var index = pred_class['0'] 
              this.pred_class_string = this.class[index].join('-')
              console.log(this.class[index])
      });
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
