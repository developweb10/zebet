import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { throttle, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BeeperService {

  private duration = 50;
  private pause = 500;
  private frequency = 440;
  private volume = 1;
  private type: OscillatorType = 'sine';

  private audioContext: AudioContext;

  private beeper = new Subject<void>();

  constructor() {
    if ( window && window.AudioContext ) {
      this.audioContext = new window.AudioContext();
    }
  }

  private beeperSubscription = this.beeper.pipe(
    throttle(() => timer(this.duration + this.pause), {leading: true, trailing: false}),
    tap(() => this.doBeep())
  ).subscribe();

  public beep() {
    this.beeper.next();
  }

  private doBeep() {
    if ( this.audioContext ) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      if (this.volume) { gainNode.gain.value = this.volume; }
      if (this.frequency) {oscillator.frequency.value = this.frequency; }
      if (this.type) {oscillator.type = this.type; }

      oscillator.start();
      setTimeout(() => oscillator.stop(), this.duration || 500);
    }
  }

}
