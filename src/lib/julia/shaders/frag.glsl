#version 300 es
precision highp float;

{{uniforms}}

in vec2 TexCoord;
out vec4 FragColor;

float Fractal(float x, float y)
{
    {{function}}
}

void main() {
    float fractalValue = Fractal(TexCoord.x, TexCoord.y);

    // TODO: make the colour calculation customizable
    // Calculate color
    float pixelValue = 1.0; // TODO: default non escaping value

    // Only escaping values
    if (fractalValue >= 0.0)
        pixelValue = fractalValue / (fractalValue + 5.0); // TODO: use falloff strength

    // Banding (can be sin, cos, or tan (tan is best)), also multiply by 100

    FragColor = vec4(pixelValue, pixelValue * pixelValue, pixelValue, pixelValue);
}
