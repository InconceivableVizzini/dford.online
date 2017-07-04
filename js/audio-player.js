var StateMachine = require('javascript-state-machine');
require('script!clubber/dist/clubber.js');

class AudioPlayer {
  constructor() {
    this._fsm();

    //this.src = '/assets/snd/rlftb.mp3';
    this.src = '/assets/snd/NCS - The Best of 2015 [Album Mix].mp3';

    this.audio = new Audio;
    this.audio.crossOrigin = "anonymous";
    this.audio.src = this.src;
    this.currentTime = this.audio.currentTime;

    this.audioContext = new AudioContext;
    this.source = this.audioContext.createMediaElementSource(this.audio);

    this.clubber = new Clubber({
      size: 2048, // FFT samples, sampled frequency bins are 1024
      mute: false,
      context: this.audioContext
    });
    this.bands = {
      low: this.clubber.band({from: 5, to: 32, smooth: [ 1,1,1,1]}),
      mid_low: this.clubber.band({from: 32, to: 48, smooth: [1,1,1,1]}),
      mid_high: this.clubber.band({from: 48, to: 64, smooth: [1,1,1,1]}),
      high: this.clubber.band({from: 64, to: 160, smooth: [1,1,1,1]})
    };
    this.clubber.listen(this.source);

    // These hold the data that is sampled from each band on update.
    this.low_band_data = new Float32Array(4);
    this.mid_low_band_data = new Float32Array(4);
    this.mid_high_band_data = new Float32Array(4);
    this.high_band_data = new Float32Array(4);
  }
  
  updateFreqTimeDomainData() {
    this.clubber.update();
    let bands = [
      this.bands.low(this.low_band_data),
      this.bands.mid_low(this.mid_low_band_data),
      this.bands.mid_high(this.mid_high_band_data),
      this.bands.high(this.high_band_data)
    ];
  }
}

class BeatAnalyser {
  constructor() { }
}
StateMachine.factory(BeatAnalyser, {
  init: 'off-beat',
  transitions: [
    { name: 'on', from: 'off-beat', to: 'on-beat' },
    { name: 'off', from: 'on-beat', to: 'off-beat' }
  ],
  methods: {
    onOn: function() {
      console.log('On beat.');
    },
    onOff: function() {
      console.log('Off beat.');
    }
  }
});

StateMachine.factory(AudioPlayer, {
  init: 'paused',
  transitions: [
    { name: 'play', from: 'paused', to: 'playing' },
    { name: 'pause', from: 'playing', to: 'paused' }
  ],
  methods: {
    onPlay: function() {
      this.audio.src = this.src;
      if (this.audio) this.audio.play();
      this.audio.currentTime = this.currentTime;
    },
    onPause: function() {
      this.currentTime = this.audio.currentTime;
      if (this.audio) this.audio.pause();
    }
  }
});

module.exports = AudioPlayer
