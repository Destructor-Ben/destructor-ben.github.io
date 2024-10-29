#version 300 es
precision highp float;

uniform mat4 uTransform;

layout(location = 0) in vec4 aVertexPosition;
layout(location = 1) in vec4 aTexCoord;

out vec2 TexCoord;

void main() {
  // Only modify the texcoords because we still want the quad to be fullscreen
  gl_Position = aVertexPosition;
  TexCoord = (uTransform * aTexCoord).xy;
}
