import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { HttpClient } from "@angular/common/http";
// import { url } from 'inspector';
import { map } from 'rxjs/operators';
import { Camera,CameraOptions } from "@ionic-native/camera/ngx";
import {  CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from "@ionic-native/camera-preview/ngx";
import { Platform } from "@ionic/angular";
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
  pred_class_string : any = "Welcome";
  picture_options: any;
  src : any;
  private win: any = window;
  window_height: any;
  constructor(
    public http:HttpClient,
    private camera : Camera,
    private cameraPreview : CameraPreview,
    private platform : Platform
    ) {
      const options: CameraPreviewOptions = {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height*0.7,
        camera: 'rear',
        tapPhoto: false,
        previewDrag: false,
        // toBack: true,
        alpha: 1
      }
      this.options = options;
      const picture_options : CameraPreviewPictureOptions =
        {
          width : 224,
          height : 224,
          quality : 85
        }
      this.picture_options = picture_options
      // start camera
      
      
     }

  ngOnInit() {
    this.window_height = window.screen.height;
    this.loadMOdel()
    this.http.get('assets/classes.json').subscribe(data =>{ 
    this.class = data;
    this.cameraPreview.startCamera(this.options).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      });
    setInterval(() =>
    {
      this.take_pic()
    },100);
   });  
    // const image = document.querySelector("#img-content")
    // const t = tf.browser.fromPixels(image)
  }

  ionViewDidEnter(){
    this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
    });
}
  

  async take_pic()
  {
    this.cameraPreview.takeSnapshot({quality: 85}).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log('image  data without formatting = '+imageData)
      this.src = this.win.Ionic.WebView.convertFileSrc(base64Image);
      console.log("image data after formatting image data -"+base64Image)
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
      tf.tidy(() => 
      {
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
        this.pred_class_string = this.class[index][1].split('_').join(' ')
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
