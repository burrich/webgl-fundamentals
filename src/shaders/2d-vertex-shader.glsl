const vertexShaderSrc = `#version 300 es
  in vec4 a_position;
  in vec4 a_color;

  uniform mat4 u_matrix;

  // A varying color to the fragment shader
  out vec4 v_color;

  /**
   * Set gl_Position by multiply the transformation matrix by the current a_position value (x,y)
   */
  void main() {
    // last arg : clipping of the vertex position in the 3D space clipping (default 1.0)
    gl_Position = u_matrix * a_position;

    v_color = a_color;
  }
`;