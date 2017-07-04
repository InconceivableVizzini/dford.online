import riot from 'riot';
import AudioPlayer from '../audio-player';
import AudioVisualizer from '../audio-visualizer';

riot.tag('visualizer',
  `
  <div class="column is-primary-column">
    <p id="audio-vidio-support" ref="audvidsupport">Web audio and WebGL support is required for this experiment, please use Google Chrome or Mozilla Firefox.</p>
    <div ref="visualizer_element" onclick={toggle_play_pause}>
      <a ref="ap_button" class="ap-button {is-play: (!this.audio || this.audio.state == 'paused')} {is-pause: (this.audio && this.audio.state == 'playing')}">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 213.7 213.7" enable-background="new 0 0 213.7 213.7" xml:space="preserve">
          <polygon class='triangle' id="XMLID_18_" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="73.5,62.5 148.5,105.8 73.5,149.1 "/>
          <circle class='circle' id="XMLID_17_" fill="none"  stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="106.8" cy="106.8" r="103.3"/>
        </svg>
      </a>
    </div>
    <p class="citation">(<a target="_new" href="https://soundcloud.com/nocopyrightsounds/ncs-the-best-of-2015-album-mix">NCS: The Best of 2015 [Album Mix]</a> by <a target="_new" href="http://nocopyrightsounds.co.uk">NOCOPYRIGHTSOUNDS</a>)</p>
    <p class="citation">"Strap yourself in" is based on work by <a class="citation-link" target="_new" href="https://twitter.com/pabloandrioli">Pablo Roman Andrioli</a></p>
    <p>An audio visualizer that analyzes music data into low/mid/high audio bands to modulate a GLSL shader. Pausing the music will leave you drifting at a modulated location.</p>
  </div>
  `,

  function (opts) {
    this.on('mount', () => {
      if (!(window.AudioContext || window.webkitAudioContext)) {
	this.refs.audvidsupport.style.display = 'block';
      }
      
      this.audio = new AudioPlayer();
      this.visual = new AudioVisualizer(this.refs.visualizer_element);

      this.windowResized();
      window.addEventListener('resize', this.windowResized);

      this.clock = 0;
      this.bustamove();
    });
    this.on('unmount', () => {
      window.removeEventListener('resize', this.windowResized);
      this.audio.audioContext.close();
      this.audio.source.disconnect();
    });
    this.toggle_play_pause = (e) => {
      if (this.audio.state == 'playing') {
	this.audio.pause();
      } else {
	this.audio.play();
      }
    }
    this.bustamove = () => {
      requestAnimationFrame(this.bustamove.bind(this));

      this.audio.updateFreqTimeDomainData();

      this.clock += 0.01;
      this.visual.lightEffectFilter.uniforms.time.value = this.clock;

      if (this.audio.state == 'playing') {

	this.visual.lightEffectFilter.uniforms.low_band_data
	  .value = {x: this.audio.low_band_data[0],
		    y: this.audio.low_band_data[1],
		    z: this.audio.low_band_data[2],
		    w: this.audio.low_band_data[3]};
	this.visual.lightEffectFilter.uniforms.mid_low_band_data
	  .value = {x: this.audio.mid_low_band_data[0],
		    y: this.audio.mid_low_band_data[1],
		    z: this.audio.mid_low_band_data[2],
		    w: this.audio.mid_low_band_data[3]};
	this.visual.lightEffectFilter.uniforms.mid_high_band_data
	  .value = {x: this.audio.mid_high_band_data[0],
		    y: this.audio.mid_high_band_data[1],
		    z: this.audio.mid_high_band_data[2],
		    w: this.audio.mid_high_band_data[3]};
	this.visual.lightEffectFilter.uniforms.high_band_data
	  .value = {x: this.audio.high_band_data[0],
		    y: this.audio.high_band_data[1],
		    z: this.audio.high_band_data[2],
		    w: this.audio.high_band_data[3]};
      }

      this.visual.renderer.render(this.visual.stage);
    }
    this.windowResized = () => {
      //var ap_button = this.refs.ap_button
      var canvas_el = this.refs.visualizer_element
	  .getElementsByTagName('canvas')[0]||{clientWidth: 1, clientHeight: 1};
      canvas_el.width = this.refs.visualizer_element.clientWidth;
      canvas_el.height = this.refs.visualizer_element.clientWidth * 0.5625; // 16:9
      //ap_button.style.transform = 'translateX('
	//+ String((canvas_el.width/2) - 21.5)
	//+ 'px) translateY(' + String((canvas_el.height/2) - 21.5)
	//+ 'px)';
      this.visual.background.width = canvas_el.width;
      this.visual.background.height = canvas_el.height;
      this.visual.renderer.resize(canvas_el.width, canvas_el.height);
      this.visual.lightEffectFilter.uniforms.resolution.value = {x:canvas_el.width,
								 y:canvas_el.height};
    }
  }
);
