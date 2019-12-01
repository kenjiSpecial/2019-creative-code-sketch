precision highp float;

varying vec2 vUv;

uniform sampler2D uBase;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform sampler2D uMask;

void main(){
    vec4 maskValue = texture2D(uMask,  vUv);

    vec4 outputColor = texture2D(uBase, vUv);

    if(maskValue.r == 0.0 && maskValue.g == 1.0 && maskValue.b == 0.0){
        outputColor = texture2D(uTexture0, vUv);
    }else if(maskValue.r == 0.0 && maskValue.g == 0.0 && maskValue.b == 1.0){
        outputColor = texture2D(uTexture1, vUv);
    }else if(maskValue.r == 1.0 && maskValue.g == 0.0 && maskValue.b == 0.0){
        outputColor = texture2D(uTexture2, vUv);
    }else if(maskValue.r == 1.0 && maskValue.g == 1.0 && maskValue.b == 0.0){
        outputColor = texture2D(uTexture3, vUv);
    }

    gl_FragColor = outputColor;
}