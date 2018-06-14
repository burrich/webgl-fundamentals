const fragmentShaderSrc = `#version 300 es
  // Default precision (mandatory ?)
  precision mediump float;

  in vec4 v_color;

  out vec4 outColor;

  void main() {
    outColor = v_color;
  }
`;