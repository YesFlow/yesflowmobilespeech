import { Component, NgZone, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SpeechModalComponent } from '../speech-components/speech-modal/speech-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentState: any;
  finalText: string;
  shouldListen$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  micDisabled: boolean = false;

  constructor(public ngZone: NgZone, public modalController: ModalController, private routerOutlet: IonRouterOutlet) {
  }

  ngOnInit(){
    //  this.pluginInit();
  }

  onSpeechResultsEvent(data:any) {
    console.log('SpeechResultsEvent',data);
    this.finalText = this.finalText || '';
    this.finalText += data?.result?.length > 0 ? data.result : '';
  }

  async launchSpeech(event:any = null) {
    const options = {
      component: SpeechModalComponent,
      componentProps: {},
      presentingElement: this.routerOutlet.nativeEl
    }
    const modalSpeech = await this.modalController.create(options);
    modalSpeech.onDidDismiss().then((results)=>{
      console.log('Dismissed Data', results.data);
      if (results?.data) {
        // this.speechResultsEvent.emit(results.data);
      }
    })
    return await modalSpeech.present();
  }

}
