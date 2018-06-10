/**
 * WebGL utils.
 */

/**
 * Create a shader, upload the source and compile.
 */
function initShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      'An error occurred compiling the shaders : ' + 
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);

    return null;
  }

  return shader;
}

/**
 * Init the shader program by creating and attaching vertex and fragment shaders
 * to the shader program, and then linking it to the context.
 */
function initProgram(gl, vertexShaderSrc, fragmentShaderSrc) {
  const vertexShader = initShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      'Unable to initialize the shader program : ' + 
      gl.getProgramInfoLog(shader)
    );
    gl.deleteProgram(program);

    return null;
  }

  return program;
}

export default initProgram;