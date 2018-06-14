/**
 * WebGL hello world.
 */

import WebGLDebugUtils from 'webgl-debug'; // TODO: rename

import webglUtils from './util/webgl-utils.js';
import m4 from './util/m4.js';
import ui from './ui.js';

import './style.css';

main(); // TODO: replace by an anonymous function ?

/**
 * Init the GL context and draw the letter F from pixel coordinates.
 * 
 * TODO: unbind vao with gl.bindVertexArray(null)
 */
function main() {
  const canvas = document.getElementById('glCanvas');
  const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl2"));

  if (!gl) {
    console.error('Unable to initialize WebGL, your browser or machine may not support it.');
    return;
  }

  // Init Shader program
  const shaderProgram = webglUtils.initProgram(gl, vertexShaderSrc, fragmentShaderSrc);

  // Look up input locations
  const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
  const colorAttributeLocation    = gl.getAttribLocation(shaderProgram, 'a_color');
  const matrixUniformLocation     = gl.getUniformLocation(shaderProgram, 'u_matrix');

  // Init position buffer

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Init vertex array object
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Fill buffer with letter F values
  setGeometry(gl);

  gl.enableVertexAttribArray(positionAttributeLocation);

  // Define how to pull out data from buffer to attribute
  let size = 3; // components count by iteration (3 for x, y and z)
  let type = gl.FLOAT; // 32 bits float
  let normalize = false; // ?
  let stride = 0; // step of (size * sizeof(type)) bytes by iteration
  let offset = 0;
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  // Init color buffer

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  setColors(gl);

  gl.enableVertexAttribArray(colorAttributeLocation);

  size = 3; 
  type = gl.UNSIGNED_BYTE; // 8 bits unsigned
  normalize = true; // convert from 0-255 to 0.0-1.0
  stride = 0; 
  offset = 0;
  gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

  // const letterWidth = 100;
  // const letterHeight = 150;

  // Translation
  // let translation = [0, 0];
  // let translation = [100, 150];
  // let translation = [150, 225]; // +50, +75
  // let translation = [gl.canvas.width / 2 - letterWidth / 2, gl.canvas.height / 2 - letterHeight / 2, 0];
  let translation = [gl.canvas.width / 2, gl.canvas.height / 2, 0];

  // Inversed angle to be clockwise because of inversed y axis
  // let angleInRadians = 0;
  let rotation = [0, 0, 0];

  const scale = [1, 1, 1];
  const color = [Math.random(), Math.random(), Math.random(), 1];

  drawScene();
  ui.setupRotationSliders(updateRotation);

  /**
   * Set a new angle in radians and update the scene. 
   */
  function updateRotation(axis, angleInDegrees) {
    rotation[axis] = angleInDegrees * Math.PI / 180;
    drawScene();
  }

  /**
   * Render random rectangles.
   */
  function drawScene() {
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 0.0); // Optionnal (default value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);

    // Don't draw triangles back faces
    gl.enable(gl.CULL_FACE);

    gl.useProgram(shaderProgram);

    // gl.bindVertexArray(vao);

    // Compute the matrices
    let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
    matrix = m4.translate(matrix, -50, -75, 0); // To simulate the rotation from the center

    // Set uniforms for shaders
    // TODO: 2f, 2fv, false... meaning ?
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    // gl.uniform4fv(colorUniformLocation, color);

    // Draw
    const primitiveType = gl.TRIANGLES; // no debug log if typo error !
    const drawOffset = 0;
    const vertexCount = 16 * 6; // 16 rect of 2 triangles of 3 vertices
    gl.drawArrays(primitiveType, drawOffset, vertexCount);
  }
}

/**
 * Fill opengl buffer (ARRAY_BUFFER) with the values that define the letter F.
 * The letter is reversed vertically because y axis is inverted in the vertex shader.
 * 
 * Front triangle have a counter-clockwise winding (before transformations).
 * See https://www.khronos.org/opengl/wiki/Face_Culling.
 */
function setGeometry(gl) {
  const letterCoordinates = new Float32Array([
    // left column front
    0,   0,  0,
    0, 150,  0,
    30,   0,  0,
    0, 150,  0,
    30, 150,  0,
    30,   0,  0,

    // top rung front
    30,   0,  0,
    30,  30,  0,
    100,   0,  0,
    30,  30,  0,
    100,  30,  0,
    100,   0,  0,

    // middle rung front
    30,  60,  0,
    30,  90,  0,
    67,  60,  0,
    30,  90,  0,
    67,  90,  0,
    67,  60,  0,

    // left column back
      0,   0,  30,
      30,   0,  30,
      0, 150,  30,
      0, 150,  30,
      30,   0,  30,
      30, 150,  30,

    // top rung back
      30,   0,  30,
    100,   0,  30,
      30,  30,  30,
      30,  30,  30,
    100,   0,  30,
    100,  30,  30,

    // middle rung back
      30,  60,  30,
      67,  60,  30,
      30,  90,  30,
      30,  90,  30,
      67,  60,  30,
      67,  90,  30,

    // top
      0,   0,   0,
    100,   0,   0,
    100,   0,  30,
      0,   0,   0,
    100,   0,  30,
      0,   0,  30,

    // top rung right
    100,   0,   0,
    100,  30,   0,
    100,  30,  30,
    100,   0,   0,
    100,  30,  30,
    100,   0,  30,

    // under top rung
    30,   30,   0,
    30,   30,  30,
    100,  30,  30,
    30,   30,   0,
    100,  30,  30,
    100,  30,   0,

    // between top rung and middle
    30,   30,   0,
    30,   60,  30,
    30,   30,  30,
    30,   30,   0,
    30,   60,   0,
    30,   60,  30,

    // top of middle rung
    30,   60,   0,
    67,   60,  30,
    30,   60,  30,
    30,   60,   0,
    67,   60,   0,
    67,   60,  30,

    // right of middle rung
    67,   60,   0,
    67,   90,  30,
    67,   60,  30,
    67,   60,   0,
    67,   90,   0,
    67,   90,  30,

    // bottom of middle rung.
    30,   90,   0,
    30,   90,  30,
    67,   90,  30,
    30,   90,   0,
    67,   90,  30,
    67,   90,   0,

    // right of bottom
    30,   90,   0,
    30,  150,  30,
    30,   90,  30,
    30,   90,   0,
    30,  150,   0,
    30,  150,  30,

    // bottom
    0,   150,   0,
    0,   150,  30,
    30,  150,  30,
    0,   150,   0,
    30,  150,  30,
    30,  150,   0,

    // left side
    0,   0,   0,
    0,   0,  30,
    0, 150,  30,
    0,   0,   0,
    0, 150,  30,
    0, 150,   0,
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, letterCoordinates, gl.STATIC_DRAW);
}

/**
 * Fill the buffer with wolors for the 'F'. 
 */
function setColors(gl) {
  const colorsValues = new Uint8Array([
    // left column front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,

    // top rung front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,

    // middle rung front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,

    // left column back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

    // top rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

    // middle rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

    // top
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,

    // top rung right
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,

    // under top rung
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,

    // between top rung and middle
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,

    // top of middle rung
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,

    // right of middle rung
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,

    // bottom of middle rung.
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,

    // right of bottom
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,

    // bottom
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,

    // left side
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
  ]);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    colorsValues,
    gl.STATIC_DRAW
  );
}