#version 300 es
precision highp float;

uniform float uReal;
uniform float uImaginary;

in vec2 TexCoord;
out vec4 FragColor;

float Julia(float x, float y, float cx, float cy, float radius)
{
    float radiusSquared = radius * radius;

    for (int iteration = 0; iteration < 100; iteration++)
    { 
        // The point escaped
        if (x * x + y * y >= radiusSquared)
        {
            // Smoothing formula
            float z = x * x + y * y;
            float ret = float(iteration) + 1.0 - log(log(z)) / log(2.0);
            return ret < 0.0 ? 0.0 : ret;
        }

        // Update position
        float tempX = x * x - y * y;
        y = 2.0 * x * y + cy;
        x = tempX + cx;
    }

    // If the point never escaped
    return -1.0;
}

void main() {
    float fractalValue = Julia(TexCoord.x, TexCoord.y, uReal, uImaginary, 4.0);

    // Calculate color
    float pixelValue = 1.0; // TODO: default non escaping value

    // Only color parts of the set
    if (fractalValue >= 0.0)
        pixelValue = fractalValue / (fractalValue + 5.0); // TODO: use falloff strength

    // Banding (can be sin, cos, or tan (tan is best))

    FragColor = vec4(tan(pixelValue * 100.0), pixelValue * pixelValue, pixelValue, pixelValue);
}
