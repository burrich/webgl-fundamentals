const fragmentShaderSrc = `
  precision mediump float; // mandatory ?

  uniform vec4 u_color;

  void main() {
    // gl_FragColor = vec4(0.75, 0, 0, 1);
    gl_FragColor = u_color;
  }
`;