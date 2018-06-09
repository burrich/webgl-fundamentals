/**
 * WebGL hello world.
 */

'use strict';

main(); // TODO: replace by an anonymous function ?

/**
 * Init the GL context and draw the letter F from pixel coordinates.
 */
function main() {
  const canvas = document.getElementById('glCanvas');

  // const gl = canvas.getContext('webgl');
  const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));

  if (!gl) {
    console.error('Unable to initialize WebGL, your browser or machine may not support it.');
    return;
  }

  // Init Shader program
  const shaderProgram = initProgram(gl, vertexShaderSrc, fragmentShaderSrc);

  // Look up input locations
  const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
  const matrixUniformLocation     = gl.getUniformLocation(shaderProgram, 'u_matrix');
  const colorUniformLocation      = gl.getUniformLocation(shaderProgram, 'u_color');

  // Init positions buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Fill buffer with letter F values
  setGeometry(gl);

  // const letterWidth = 100;
  // const letterHeight = 150;

  // Translation
  // let translation = [0, 0];
  // let translation = [100, 150];
  // let translation = [150, 225]; // +50, +75
  // let translation = [gl.canvas.width / 2 - letterWidth / 2, gl.canvas.height / 2 - letterHeight / 2];
  let translation = [gl.canvas.width / 2, gl.canvas.height / 2];

  // Inversed angle to be clockwise because of inversed y axis
  let angleInRadians = 0;

  const scale = [1, 1];
  const color = [Math.random(), Math.random(), Math.random(), 1];

  drawScene();
  setAngleSlider(updateAngle);


  // Update rectangle position at 60fps
  // const intervalId = setInterval(() => {
  //   if (translation[0] === gl.canvas.width - width) {
  //     clearInterval(intervalId);
  //   }

  //   drawScene();
  //   translation[0] += 10;
  // }, 16.7);


  function updateAngle(angleInDegrees) {
    angleInRadians = (360 - angleInDegrees) * Math.PI / 180;
    drawScene();
  }

  /**
   * Render random rectangles.
   */
  function drawScene() {
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 0.0); // Optionnal (default value)
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    gl.enableVertexAttribArray(positionAttributeLocation);
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const size = 2; // components count by iteration (x, y)
    const type = gl.FLOAT;
    const normalize = false; // ?
    const stride = 0; // step of (size * sizeof(type)) bytes by iteration
    const offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    
    // Compute the matrices
    let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = m3.translate(matrix, translation[0], translation[1]);
    matrix = m3.rotate(matrix, angleInRadians);
    matrix = m3.scale(matrix, scale[0], scale[1]);
    matrix = m3.translate(matrix, -50, -75); // To simulate the rotation from the center

    // Set uniforms for shaders
    // TODO: 2f, 2fv, false... meaning ?
    gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);
    gl.uniform4fv(colorUniformLocation, color);

    // Draw
    const primitiveType = gl.TRIANGLES; // no debug log if typo error !
    const drawOffset = 0;
    const vertexCount = 18;
    gl.drawArrays(primitiveType, drawOffset, vertexCount);
  }
}

/**
 * Fill opengl buffer (ARRAY_BUFFER) with the values that define the letter F.
 * The letter is reversed vertically because y axis is inverted in the vertex shader.
 */
function setGeometry(gl) {
  const letterCoordinates = new Float32Array([
    // left column
    0, 0,
    30, 0,
    0, 150,
    0, 150,
    30, 0,
    30, 150,

    // top rung
    30, 0,
    100, 0,
    30, 30,
    30, 30,
    100, 0,
    100, 30,

    // middle rung
    30, 60,
    67, 60,
    30, 90,
    30, 90,
    67, 60,
    67, 90,
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, letterCoordinates, gl.STATIC_DRAW);
}