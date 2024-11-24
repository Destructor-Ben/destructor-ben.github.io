#version 300 es
precision highp float;

{{uniforms}}

uniform vec4 uFractalColor;
uniform vec4 uBackgroundColor;

uniform vec4 uSetColor;
uniform float uSetValue;
uniform bool uUseSetColorOverValue;

uniform int uFalloffType;
uniform float uFalloffStrength;

in vec2 TexCoord;
out vec4 FragColor;

float Fractal(float x, float y)
{
    {{function}}
}

float CalculateFalloff(float x)
{
    // Sigmoid
    if (uFalloffType == 0)
        return x / (x + uFalloffStrength);

    // Power
    if (uFalloffType == 1)
        return pow(x, uFalloffStrength);

    return x;
}

void main() {
    float fractalValue = Fractal(TexCoord.x, TexCoord.y);

    // Use set value by default
    float pixelValue = uSetValue;

    // If not part of the set, then calculate falloff
    if (fractalValue >= 0.0)
        pixelValue = CalculateFalloff(fractalValue);
    
    // If part of the set && we want color instead of pixelValue
    if (uUseSetColorOverValue)
    {
        FragColor = uSetColor;
        return;
    }

    // Calculate final color
    FragColor = mix(uBackgroundColor, uFractalColor, vec4(pixelValue));
}
