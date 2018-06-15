const vertexShaderSrc = `#version 300 es
  in vec4 a_position;
  in vec4 a_color;

  uniform mat4 u_matrix;

  // A varying color to the fragment shader
  out vec4 v_color;

  /**
   * Set gl_Position and pass color to fragment shader.
   */
  void main() {
    gl_Position = u_matrix * a_position;

    v_color = a_color;
  }
`;