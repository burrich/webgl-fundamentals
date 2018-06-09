const vertexShaderSrc = `
  attribute vec2 a_position;

  uniform mat3 u_matrix;

  /**
   * Set gl_Position by multiply the transformation matrix by the current a_position value (x,y)
   */
  void main() {
    // last arg : clipping of the vertex position in the 3D space clipping (default 1.0)
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  }
`;