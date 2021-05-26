import { Component, OnInit } from '@angular/core';
import { YesflowSpeechUI } from 'node_modules/@capacitor-yesflow/speechui';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {}

  ngOnInit(){
     this.pluginInit();

  }

  async pluginInit() {
    const echoResult = await YesflowSpeechUI.echo({value: 'echo this'});
    console.log('Echoresult', echoResult);
    const speechOptions = {
      showPartialResults: true
    }
    const startSpeech = await YesflowSpeechUI.startSpeech({value: speechOptions});
    console.log('StartSpeech', startSpeech);
    await YesflowSpeechUI.stopSpeech({value:''});
  }

}
