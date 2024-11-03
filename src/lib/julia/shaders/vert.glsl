#version 300 es
precision highp float;

uniform mat4 uTransform;

layout(location = 0) in vec4 VertexPosition;

out vec2 TexCoord;

void main() {
  // Only modify the texcoords because we still want the quad to be fullscreen
  gl_Position = VertexPosition;
  TexCoord = (uTransform * VertexPosition).xy;
}
