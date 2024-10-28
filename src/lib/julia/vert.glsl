precision highp float;

attribute vec4 VertexPosition;

varying vec2 TexCoord;

void main() {
  gl_Position = VertexPosition;
  TexCoord = VertexPosition.xy;
}
