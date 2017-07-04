precision mediump float;

// This is based on "Star Nest" by Pablo Roman Andrioli
#define iterations 17
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.1

#define zoom   0.800
#define tile   0.850
#define speed  0.010

#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850

uniform vec4 low_band_data;
uniform vec4 mid_low_band_data;
uniform vec4 mid_high_band_data;
uniform vec4 high_band_data;
uniform vec2 resolution;
uniform float time;

mat4 rotationMatrix(vec3 axis, float angle)
{
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  
  return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
	      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
	      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
	      0.0,                                0.0,                                0.0,                                1.0);
}

void main()
{
  float mid_range = mix(mid_low_band_data.x, mid_high_band_data.x, 0.5);
  float low_mid_range = mix(low_band_data.x, mid_range, 0.5);
  float high_mid_range = mix(high_band_data.x, mid_range, 0.5);
  float modulation = mix(low_mid_range, high_mid_range, 0.5);

  //get coords and direction
  vec2 uv=gl_FragCoord.xy/resolution.xy-.5;
  uv.y*=resolution.y/resolution.x;

  // Slowly rotate around the Z axis, modulate this direction also, slightly.
  float dm = modulation;
  if (dm < .2) dm=1.; // If audio energy is low, add a bound for slight rotation.
  vec3 dir = vec3(rotationMatrix(vec3(0.,0.,1.),time*(dm*.1))*vec4(uv*zoom, 1., 0.));
  float _time=time*speed+.25;

  // Modulate the "flow direction" between top->down and right->left
  vec3 down = vec3(0., _time, mix(low_band_data.x, high_band_data.x, .5));
  vec3 left = vec3(_time, 0., modulation);
  vec3 from = mix(down, left, modulation);
  
  //volumetric rendering
  float s=0.1,fade=1.;
  vec3 v=vec3(0.);
  for (int r=0; r<volsteps; r++) {
    vec3 p=from+s*dir*.5;
    p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
    float pa,a=pa=0.;
    for (int i=0; i<iterations; i++) {
      p=abs(p)/dot(p,p)-formuparam; // the magic formula
      a+=abs(length(p)-pa); // absolute sum of average change
      pa=length(p);
    }
    //float dm=mix(mid_low_band_data.x, mid_high_band_data.x, 0.5);
    float dm=max(0.,darkmatter-a*a*.001); //dark matter
    a*=a*a; // add contrast
    if (r>6) fade*=1.-dm; // dark matter, don't render near
    //v+=vec3(dm,dm*.5,0.);
    v+=fade;

    v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
    fade*=distfading; // distance fading
    s+=stepsize;
  }
  v=mix(vec3(length(v)),v,saturation); //color adjust
  gl_FragColor = vec4(v*.01,1.);  
}
