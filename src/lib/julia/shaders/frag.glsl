#version 300 es
precision highp float;

{{params_uniforms}}

in vec2 TexCoord;
out vec4 FragColor;

float Fractal(float x, float y {{params_def}})
{
    // TODO: mandelbrot only does this differently
    //cx = x;
    //cy = y;

    for (int iteration = 0; iteration < {{max_iterations}}; iteration++)
    { 
        float sqrDst = x * x + y * y;

        // The point escaped
        if (sqrDst >= uRadiusSquared)
        {
            // TODO: customizable smoothing formula
            // Smoothing formula
            float ret = float(iteration) + 1.0 - log(log(sqrDst)) / log(2.0);
            return ret < 0.0 ? 0.0 : ret;
        }

        // Update position
        // TODO: customizable equation - for mandelbrot this stays the same
        float tempX = x * x - y * y + cx;
        y = 2.0 * x * y + cy;
        x = tempX;
    }

    // If the point never escaped
    return -1.0;
}

void main() {
    float fractalValue = Fractal(TexCoord.x, TexCoord.y {{params_call}});

// TODO: make the colour calculation customizable
    // Calculate color
    float pixelValue = 1.0; // TODO: default non escaping value

    // Only escaping values
    if (fractalValue >= 0.0)
        pixelValue = fractalValue / (fractalValue + 5.0); // TODO: use falloff strength

    // Banding (can be sin, cos, or tan (tan is best)), also multiply by 100

    FragColor = vec4(pixelValue, pixelValue * pixelValue, pixelValue, pixelValue);
}
