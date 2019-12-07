precision highp float;

varying vec2 vUv;

uniform sampler2D uPicTex;
uniform sampler2D uBaseTex;
uniform float uFlush;
uniform float uState;

void main(){
    vec4 baseColor = texture2D(uBaseTex, vUv);
    vec4 picColor = texture2D(uPicTex, vUv);
    vec4 flashColor = vec4(1.0);
    vec4 outputColor = mix(mix(baseColor, picColor, uState), flashColor, uFlush);

    gl_FragColor = outputColor;
}