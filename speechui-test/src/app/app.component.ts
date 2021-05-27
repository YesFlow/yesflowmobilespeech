import { Component, OnInit } from '@angular/core';
import { SpeechState, YesflowSpeechUI} from 'node_modules/@capacitor-yesflow/speechui';
import { NativeSpeechProviderService } from './speech-components/providers/native-speech-provider.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public nativeSpeechProvider: NativeSpeechProviderService
  ) {


  }
  ngOnInit() {
    YesflowSpeechUI.available().then(()=>{console.log('SpeechIsAvailable')})
  }
}
