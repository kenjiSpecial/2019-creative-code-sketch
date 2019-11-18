#define PI 3.141592653589793

precision highp float;
attribute vec3 position;
attribute vec3 initPosition;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uScale;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;

varying float vRate;

void main(){
    float rate =  (cos(uTime * 0.6 + PI) + 1.)/2.;
    vec3 curPosition = mix(initPosition, position, rate);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( curPosition, 1.0);

    vec2 uv  = vec2( 
        ((gl_Position.x / gl_Position.w + 1.0) * 0.5  - 0.5) * uScale * 1.5 + 0.5, 
        ((gl_Position.y / gl_Position.w + 1.0) * 0.5 - 0.5) * 1.5 + 0.5
        );
    vec4 color = texture2D(uTexture, uv);
    
    float dz = color.r * (2.0 + 0.5 * uMouse.y);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( curPosition.x , curPosition.y,  dz, 1.0);

    vRate =rate;
}
