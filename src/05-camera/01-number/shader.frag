precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uFontTexture; 
uniform float uGridSize;
uniform vec2 uWindowSize;

varying vec2 vUv;


void main(){
    vec2 windowSize = vUv * uWindowSize;
    vec2 gridIndex = floor(windowSize/uGridSize);
    vec2 customUv = (gridIndex * uGridSize)/uWindowSize;
    vec4 textureColor = texture2D(uTexture, customUv);
    vec2 gridUv = (windowSize - gridIndex * uGridSize) / uGridSize;
    gridUv.x = 1.0 - gridUv.x;
    float blackWhite = (textureColor.r + textureColor.g + textureColor.b )/3.;

    float rate = floor(blackWhite * 9.);
    float col = mod(rate, 3.);
    float row = floor(rate/ 3.);

    vec2 outputUv = vec2(gridUv.x / 3. + 0.333 * col, gridUv.y/3. + 0.333  * row);

    vec4 outColor = texture2D(uFontTexture, outputUv);//vec4(gridUv, 0.0, 1.0);

    gl_FragColor = outColor;
}