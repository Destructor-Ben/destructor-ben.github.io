precision highp float;

uniform float Real;
uniform float Imaginary;

varying vec2 TexCoord;

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
  float fractalValue = Julia(TexCoord.x, TexCoord.y, Real, Imaginary, 4.0);
  gl_FragColor = vec4(fractalValue, fractalValue, fractalValue, 1.0);
}