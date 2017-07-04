require('script!pixi.js/bin/pixi.js');

class AudioVisualizer {
  constructor(el) {
    // http://www.pixijs.com
    this.width = el.clientWidth;
    this.height = this.width * 0.5625;

    this.renderer = new PIXI.autoDetectRenderer(this.width, this.height);
    el.appendChild(this.renderer.view);

    // Everything in this will be rendered.
    this.stage = new PIXI.Container();

    //var leFragmentShader = require('../shaders/light-effect.fs');
    var leFragmentShader = require('../shaders/strapyourselfin.fs');
    var leUniforms = {
      resolution: { type: 'v2', value: {x: this.width, y: this.height} },
      low_band_data: { type: 'v4', value: {x:0,y:0,z:0,w:0}},
      mid_low_band_data: { type: 'v4', value: {x:0,y:0,z:0,w:0}},
      mid_high_band_data: { type: 'v4', value: {x:0,y:0,z:0,w:0}},
      high_band_data: { type: 'v4', value: {x:0,y:0,z:0,w:0}},
      //alpha: { type: '1f', value: 1.0 },
      //shift: { type: '1f', value: 1.6 },
      time: { type: '1f', value: 0},
      //speed: { type: 'v2', value: {x:0.7, y:0.5} }
    };

    this.lightEffectFilter = new PIXI.AbstractFilter('',
						     leFragmentShader,
						     leUniforms);

    this.background = PIXI.Sprite.fromImage("http://www.goodboydigital.com/pixijs/pixi_v3_github-pad.png", true);
    this.background.width = this.width;
    this.background.height = this.height;
    this.background.filters = [this.lightEffectFilter];
    this.stage.addChild(this.background);
  }

}

module.exports = AudioVisualizer
