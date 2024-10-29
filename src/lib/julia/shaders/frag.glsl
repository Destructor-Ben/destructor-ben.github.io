#version 300 es
precision highp float;

{{params_uniforms}}

in vec2 TexCoord;
out vec4 FragColor;

float Fractal(float x, float y {{params_def}})
{
    for (int iteration = 0; iteration < {{max_iterations}}; iteration++)
    { 
        // The point escaped
        if (x * x + y * y >= {{radius_squared}})
        {
            // TODO: customizable smoothing formula
            // Smoothing formula
            float z = x * x + y * y;
            float ret = float(iteration) + 1.0 - log(log(z)) / log(2.0);
            return ret < 0.0 ? 0.0 : ret;
        }

        // Update position
        // TODO: customizable equation
        float tempX = x * x - y * y;
        y = 2.0 * x * y + cy;
        x = tempX + cx;
    }

    // If the point never escaped
    return -1.0;
}

void main() {
    float fractalValue = Fractal(TexCoord.x, TexCoord.y {{params_call}});

// TODO: make the colour calculation customizable
    // Calculate color
    float pixelValue = 1.0; // TODO: default non escaping value

    // Only color parts of the set
    if (fractalValue >= 0.0)
        pixelValue = fractalValue / (fractalValue + 5.0); // TODO: use falloff strength

    // Banding (can be sin, cos, or tan (tan is best)), also multiply by 100

    FragColor = vec4(pixelValue, pixelValue * pixelValue, pixelValue, pixelValue);
}
