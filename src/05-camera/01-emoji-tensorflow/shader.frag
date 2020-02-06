precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uFontTexture; 
uniform sampler2D uMask; 
uniform float uTime;
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
    // float dist = distance(vUv* windowSize, vec2(0.5) *  windowSize );
    float blackWhite = mix( 
        cos(uTime * 0.5) * 0.49 + 0.5, 
        (textureColor.r + textureColor.g + textureColor.b )/3.0, 
        maskVal);

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