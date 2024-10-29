precision highp float;

attribute vec4 aVertexPosition;
attribute vec4 aTexCoord;

uniform mat4 uTransform;

varying vec2 TexCoord;

void main() {
  // Only modify the texcoords because we still want the quad to be fullscreen
  gl_Position = aVertexPosition;
  TexCoord = (uTransform * aTexCoord).xy;
}
