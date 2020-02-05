precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uFontTexture; 
uniform sampler2D uMask; 

uniform vec2 uWindowSize;
uniform float uGridMinSize;
uniform float uGridMaxSize;
uniform float uProgress;
uniform float uProcess;

varying vec2 vUv;


void main(){
    float maskVal = texture2D(uMask, vUv).r;
    float gridSize = mix(uGridMaxSize, uGridMinSize, maskVal);
    vec2 windowSize = vUv * uWindowSize;
    vec2 gridIndex = floor(windowSize/gridSize);
    vec2 customUv = (gridIndex * gridSize)/uWindowSize;
    vec4 textureColor = texture2D(uTexture, customUv);
    float blackWhite = (textureColor.r + textureColor.g + textureColor.b )/3. * mix(0., 1.0, maskVal);

    if(uProcess == 1.0){
        vec2 gridUv = (windowSize - gridIndex * gridSize) / gridSize;
        gridUv.x = 1.0 - gridUv.x;
        float rate = floor(mix(6., blackWhite * 9., uProgress));
        float col = mod(rate, 3.);
        float row = floor(rate / 3.);

        vec2 outputUv = vec2(gridUv.x / 3. + 0.333 * col, gridUv.y/3. + 0.333  * row);
        vec4 outColor = texture2D(uFontTexture, outputUv);

        gl_FragColor = outColor;
    }else{
        blackWhite = floor(blackWhite * 9.)/9.;
        gl_FragColor = vec4(blackWhite, blackWhite, blackWhite, 1.0);
    }
    
    // gl_FragColor = texture2D(uMask, vUv);
}