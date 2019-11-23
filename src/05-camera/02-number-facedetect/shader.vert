#define PI 3.141592653589793

precision highp float;
attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
  
varying vec2 vUv;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);

    vUv = vec2(1.0 - uv.x, uv.y);
}
