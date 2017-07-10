import riot from 'riot';
import AudioPlayer from '../audio-player';
import AudioVisualizer from '../audio-visualizer';

var hljs = require('../../node_modules/highlight.js/lib/index.js');

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
    <p>This experiment was mainly just a way to start playing with using audio data to modulate visual effects. I did not want to only analyse the frequency or time domain data for a simple bar or line style analyser, but I did want to keep things basic for this one so I have simply shown combining various parts of the frequency data into low/mid/high mixes.</p>
    <p>I used the js library <a href="https://github.com/wizgrav/clubber" target="_new">Clubber</a> to extract the frequency information into collections of MIDI notes. This is a very nifty little library, with source code that is easy to follow and understand. If you want to create audio visualizations with javascript, I highly recommend it. For my purposes I use clubber to dump MIDI note signal data into arrays of four 32-bit floats. This is something a GLSL shader will understand to be a vec4.</p>
    <pre>
<code class="js">
...
  ... 
    ...
    this.clubber = new Clubber(\\{
      size: 2048, // FFT samples, sampled frequency bins are 1024
      mute: false,
      context: this.audioContext
    \\});
    this.bands = \\{
      low: this.clubber.band(\\{from: 5, to: 32, smooth: [ 1,1,1,1]\\}),
      mid_low: this.clubber.band(\\{from: 32, to: 48, smooth: [1,1,1,1]\\}),
      mid_high: this.clubber.band(\\{from: 48, to: 64, smooth: [1,1,1,1]\\}),
      high: this.clubber.band(\\{from: 64, to: 160, smooth: [1,1,1,1]\\})
    \\}
    this.clubber.listen(this.source);

    // These hold the data that is sampled from each band on update.
    this.low_band_data = new Float32Array(4);
    this.mid_low_band_data = new Float32Array(4);
    this.mid_high_band_data = new Float32Array(4);
    this.high_band_data = new Float32Array(4);
  \\}

  updateFreqTimeDomainData() \\{
    this.clubber.update();
    this.bands.low(this.low_band_data);
    this.bands.mid_low(this.mid_low_band_data);
    this.bands.mid_high(this.mid_high_band_data);
    this.bands.high(this.high_band_data);
  \\}
  ...
...
</code>
    </pre>
    <p>A GLSL shader is given access to this data as a uniform.</p>
    <pre>
<code class="js">
...
  ...
  this.render = () => \\{
    requestAnimationFrame(this.render.bind(this));

    this.audio.updateFreqTimeDomainData();

    this.clock += 0.01;
    this.visual.lightEffectFilter.uniforms.time.value = this.clock;

    if (this.audio.state == 'playing') \\{
      this.visual.lightEffectFilter.uniforms.low_band_data
        .value = \\{x: this.audio.low_band_data[0],
		  y: this.audio.low_band_data[1],
		  z: this.audio.low_band_data[2],
		  w: this.audio.low_band_data[3]\\};
      this.visual.lightEffectFilter.uniforms.mid_low_band_data
        .value = \\{x: this.audio.mid_low_band_data[0],
		  y: this.audio.mid_low_band_data[1],
		  z: this.audio.mid_low_band_data[2],
		  w: this.audio.mid_low_band_data[3]\\};
      this.visual.lightEffectFilter.uniforms.mid_high_band_data
        .value = \\{x: this.audio.mid_high_band_data[0],
		  y: this.audio.mid_high_band_data[1],
		  z: this.audio.mid_high_band_data[2],
		  w: this.audio.mid_high_band_data[3]\\};
      this.visual.lightEffectFilter.uniforms.high_band_data
        .value = \\{x: this.audio.high_band_data[0],
		  y: this.audio.high_band_data[1],
		  z: this.audio.high_band_data[2],
		  w: this.audio.high_band_data[3]\\};
    \\}

    this.visual.renderer.render(this.visual.stage);
  \\}
  ...
...
</code>
    </pre>
    <p>In the shader, these are made available by --</p>
    <pre>
<code class="c">
uniform vec4 low_band_data;
uniform vec4 mid_low_band_data;
uniform vec4 mid_high_band_data;
uniform vec4 high_band_data;
uniform vec2 resolution;
uniform float time;
</code>
    </pre>
    <p>And they are used to create the modulated effect by changing the properties of direction vectors --</p>
    <pre>
<code class="c">
...

mat4 rotationMatrix(vec3 axis, float angle)
\\{
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
              oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
              oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
              0.0,                                0.0,                                0.0,                                1.0);
\\}

void main()
\\{
  float mid_range = mix(mid_low_band_data.x, mid_high_band_data.x, 0.5);
  float low_mid_range = mix(low_band_data.x, mid_range, 0.5);
  float high_mid_range = mix(high_band_data.x, mid_range, 0.5);
  float modulation = mix(low_mid_range, high_mid_range, 0.5);

  ...

  // Slowly rotate around the Z axis, modulate this direction also, slightly.
  float dm = modulation;
  if (dm < .2) dm=1.; // If audio energy is low, add a bound for slight rotation.
  vec3 dir = vec3(rotationMatrix(vec3(0.,0.,1.),time*(dm*.1))*vec4(uv*zoom, 1., 0.));
  float _time=time*speed+.25;

  // Modulate the "flow direction" between top->down and right->left
  vec3 down = vec3(0., _time, mix(low_band_data.x, high_band_data.x, .5));
  vec3 left = vec3(_time, 0., modulation);
  vec3 from = mix(down, left, modulation);

  ...
</code>
    </pre>
    <p>First the direction of motion of particles is rotated around the Z axis by multiplying the original vec4 by a rotationMatrix using a Z unit vector and an angle modulated by the low and mid audio range frequency data.</p>
    <pre>
<code class="c">
vec3 dir = vec3(rotationMatrix(vec3(0.,0.,1.),time*(dm*.1))*vec4(uv*zoom, 1., 0.));
</code>
    </pre>
    <p>Next, the particle motion is modulated to switch between a top->down and right->left flow direction for particles as the audio frequency data changes.</p>
    <pre>
<code class="c">
// Modulate the "flow direction" between top->down and right->left
vec3 down = vec3(0., _time, mix(low_band_data.x, high_band_data.x, .5));
vec3 left = vec3(_time, 0., modulation);
vec3 from = mix(down, left, modulation);
</code>
    </pre>
  </div>
  `,

  function (opts) { 
    this.on('mount', () => {
      hljs.initHighlighting();
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
