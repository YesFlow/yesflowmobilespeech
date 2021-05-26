import { Component, NgZone, OnInit } from '@angular/core';
import { SpeechState, YesflowSpeechUI } from 'node_modules/@capacitor-yesflow/speechui';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  timeBegan = null
  timeStopped:any = null
  stoppedDuration:any = 0
  started = null
  running = false
  blankTime = "00:00.000"
  time = "00:00.000"

  currentState: any;
  currentText: string;
  finalText: string;
  resultsTextArray: string[] = [];
  shouldListen$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(public ngZone: NgZone) {
    YesflowSpeechUI.addListener('speechResults', (data: any) => {
      this.ngZone.run(()=>{
        if (this.shouldListen$?.value) {
          if (data.resultText?.length > 0) {
            this.currentText = data.resultText;
          }
        }
      })
    });
    YesflowSpeechUI.addListener('speechStateUpdate', (data: any) => {
      this.ngZone.run(()=>{
        this.currentState = data?.state;
        if (this.currentState === SpeechState.STATE_STOPPED.toString()) {
          this.stopTimer();
            this.moveCurrentResultsToPermanentResults();
            if (this.shouldListen$?.value) {
              this.currentState = SpeechState.STATE_RESTARTING;
              this.startRecording();
            }

        }
        console.log('SpeechState: ', data);

      })
    });
  }

  ngOnInit(){
    //  this.pluginInit();

  }

  moveCurrentResultsToPermanentResults() {
    this.resultsTextArray.push(this.currentText);
    this.currentText = '';
  }

  startTimer() {
    if(this.running) return;
    if (this.timeBegan === null) {
        this.resetTimer();
        this.timeBegan = new Date();
    }
    if (this.timeStopped !== null) {
      let newStoppedDuration:any = (+new Date() - this.timeStopped)
      this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
    }
    this.started = setInterval(this.clockRunning.bind(this), 10);
      this.running = true;
    }
    stopTimer() {
      this.running = false;
      this.timeStopped = new Date();
      clearInterval(this.started);
   }
    resetTimer() {
      this.running = false;
      clearInterval(this.started);
      this.stoppedDuration = 0;
      this.timeBegan = null;
      this.timeStopped = null;
      this.time = this.blankTime;
    }
    zeroPrefix(num, digit) {
      let zero = '';
      for(let i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    }
    clockRunning(){
      let currentTime:any = new Date()
      let timeElapsed:any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
      let hour = timeElapsed.getUTCHours()
      let min = timeElapsed.getUTCMinutes()
      let sec = timeElapsed.getUTCSeconds()
      let ms = timeElapsed.getUTCMilliseconds();
      this.time =
        this.zeroPrefix(hour, 2) + ":" +
        this.zeroPrefix(min, 2) + ":" +
        this.zeroPrefix(sec, 2) + "." +
        this.zeroPrefix(ms, 3);
    };


  async checkPermissions() {
    const available = await YesflowSpeechUI.available();
    console.log('checkPermissions: ', available);
    const hasPermissions = await YesflowSpeechUI.hasPermission();
    console.log('hasPermissions: ', hasPermissions);
    if (!hasPermissions) {
      const request = await YesflowSpeechUI.requestPermission();
      console.log('requestPermissions: ', request);
    }
  }

  get finalResults() {
    return (this.resultsTextArray && this.resultsTextArray.length) ? this.resultsTextArray.join(' ') : ``;
  }

  async stopRecording() {
    this.stopTimer();
    this.shouldListen$?.next(null);
    this.moveCurrentResultsToPermanentResults();
    await YesflowSpeechUI.stop();
  }

  cancelLast() {
    this.currentText = '';
    this.stopRecording();
    this.currentState = SpeechState.STATE_RESTARTING.toString();
    setTimeout(() => {
       this.startRecording()
    }, 1500);
  }

  addNow() {
    this.stopRecording();
    this.currentState = SpeechState.STATE_RESTARTING.toString();
    setTimeout(() => {
       this.startRecording()
    }, 1500);
  }




  finish() {
    this.stopRecording();
    this.finalText = this.finalResults;
    console.log('Final Text', this.finalText);
    this.shouldListen$?.next(null);
    this.currentText = '';
    this.resultsTextArray = [];
  }

  async startRecording() {
    this.stopTimer();
    this.startTimer();
    const speechOptions = {
      showPartialResults: true
    }
   this.checkPermissions().then(()=>{
    let options = {
      language: 'en-US',
      maxResults: 5,
      prompt: '',
      popup: false,
      partialResults: true
    };
    this.currentText = '';
    this.shouldListen$?.next(true);
    YesflowSpeechUI.start(options).then((value)=>{
      console.log('SpeechUI Finished', value);
    }, (error)=>{
      console.log('SpeechUI Errored', error);
    })
   })
  }


}
