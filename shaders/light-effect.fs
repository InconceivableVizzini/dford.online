precision mediump float;

uniform vec4 low_band_data;
uniform vec4 mid_low_band_data;
uniform vec4 mid_high_band_data;
uniform vec4 high_band_data;
uniform vec2 resolution;
uniform float time;

void main() {
  vec3 c;
  vec2 uv;
  vec2 p;
  float l,z = time;

  for(int i = 0; i<3; i++) {
    p = gl_FragCoord.xy/resolution.xy; // remap between 0.0-1.0
    uv = p;
    p -=.5; // Position to center
    //p.x*=resolution.x/resolution.y*1.9; // how "squished"
    //p.x*=mid_low_band_data.x;
    p.x*= mix(mid_low_band_data.x, mid_high_band_data.x, 0.5);
    z+=.07;                         
    l=length(p);
    uv+=p/l*(sin(z)+1.0)*abs(sin(l*9.0-z*2.0));
    c[i] = .01/length(abs(mod(uv,1.0)-0.5));
  }
  gl_FragColor = vec4(c/l, 1.0);
  //gl_FragColor.rgb = 0.0;
  //gl_FragColor.r = 1.0;
}
