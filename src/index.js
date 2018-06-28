/**
 * WebGL hello world.
 */

import WebGLDebugUtils from 'webgl-debug'; // TODO: rename

import webglUtils from './util/webgl-utils.js';
import m4 from './util/m4.js';
import ui from './ui.js';

import './style.css';

// Trifoce base values (equilateral triangle)
const triangleLength = 150;
const triangleHeight = triangleLength * Math.sqrt(3) / 2;
const triangleDepth = 35;
const triangleApothem = triangleHeight / 3; // height of the center from each vertex

main(); // TODO: replace by an anonymous function ?

/**
 * Init the GL context and draw the triforce (base).
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

  // Fill buffer with triforce values
  setTriforceCoordinates(gl);

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

  // Transformations
  
  const translation = [
    0,
    0,
    -360
  ];
  
  const xDegreesRotation = 0;
  const yDegreesRotation = 180;
  const zDegreesRotation = 0;

  const rotation = [
    degreesToRadians(xDegreesRotation),
    degreesToRadians(yDegreesRotation),
    degreesToRadians(zDegreesRotation)
  ];

  const scale = [1, 1, 1];
  
  drawScene();

  // Init ui sliders
  // TODO: async
  ui.setupRotationSliders(updateRotation);
  ui.update(xDegreesRotation, yDegreesRotation, zDegreesRotation, true);

  /**
   * Set a new angle in radians and update the scene. 
   */
  function updateRotation(axis, angleInDegrees) {
    rotation[axis] = degreesToRadians(angleInDegrees);
    drawScene();
  } 

  /**
   * Convert an angle from degrees to radians.
   */
  function degreesToRadians(angleInDegrees) {
    return angleInDegrees * Math.PI / 180;
  }

  /**
   * Render the triforce (base).
   */
  function drawScene() {
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear color and depth buffers (for depth testing)
    gl.clearColor(0.0, 0.0, 0.0, 0.0); // Optionnal (default value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Don't draw pixels which are behind other pixels
    gl.enable(gl.DEPTH_TEST);

    // Don't draw triangles back faces (determined by vertices order)
    gl.enable(gl.CULL_FACE);

    gl.useProgram(shaderProgram);

    gl.bindVertexArray(vao);

    // Compute the matrices

    // Apply perspective 
    // nb : with perspective matrix, 
    // the figure is rendered with a y rotation of 180 deg (y axis is up)
    const fov = degreesToRadians(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    // let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    let matrix = m4.perspective(fov, aspect, zNear, zFar);

    // matrix = m4.multiply(matrix, m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400));
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    // Simulate the rotation from the center
    matrix = m4.translate(matrix, 
      - triangleLength / 2, 
      Math.sin(30) * triangleApothem, 
      triangleDepth / 2
    );

    // Set uniforms for shaders
    // TODO: 2f, 2fv, false... meaning ?
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

    // Draw
    const primitiveType = gl.TRIANGLES; // no debug log if typo error !
    const drawOffset = 0;
    const vertexCount = 24;
    gl.drawArrays(primitiveType, drawOffset, vertexCount);
  }
}

/**
 * Fill opengl buffer (ARRAY_BUFFER) with the values that define the triforce (base only).
 * 
 * Front triangles have a counter-clockwise winding (before transformations).
 * See https://www.khronos.org/opengl/wiki/Face_Culling.
 */
function setTriforceCoordinates(gl) {
  const coordinates = new Float32Array([
    // Front
    0, 0, 0,
    triangleLength / 2, triangleHeight, 0,
    triangleLength, 0, 0,

    // Back
    0, 0, triangleDepth,
    triangleLength, 0, triangleDepth,
    triangleLength / 2, triangleHeight, triangleDepth,

    // Bottom left
    0, 0, 0,
    triangleLength, 0, 0,
    0, 0, triangleDepth,

    // Bottom right
    0, 0, triangleDepth,
    triangleLength, 0, 0,
    triangleLength, 0, triangleDepth,     

    // Left side top
    0, 0, 0,
    0, 0, triangleDepth,
    triangleLength / 2, triangleHeight, 0,

    // Left side bottom
    triangleLength / 2, triangleHeight, 0,
    0, 0, triangleDepth,
    triangleLength / 2, triangleHeight, triangleDepth,

    // right side top
    triangleLength, 0, 0,
    triangleLength / 2, triangleHeight, 0,
    triangleLength, 0, triangleDepth,

    // right side bottom
    triangleLength, 0, triangleDepth,
    triangleLength / 2, triangleHeight, 0,
    triangleLength / 2, triangleHeight, triangleDepth,
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, coordinates, gl.STATIC_DRAW);
}

/**
 * Fill the buffer with colors. 
 */
function setColors(gl) {
  const colorsValues = new Uint8Array([
    // Front
    218, 165,  32,
    218, 165,  32,
    218, 165,  32,

    // Back
      0,   0,   0,
      0,   0,   0,
      0,   0,   0,

    // Bottom left
    218, 165,  32,
    218, 165,  32,
    0,   0,   0,

    // Bottom right
    0,   0,   0,
    218, 165,  32,
    0,   0,   0,

    // Left side top
    218, 165,  32,
    0,   0,   0,
    218, 165,  32,

    // Left side bottom
    218, 165,  32,
    0,   0,   0,
    0,   0,   0,

    // Right side top
    218, 165,  32,
    218, 165,  32,
    0,   0,   0,

    // Right side bottom
    0,   0,   0,
    218, 165,  32,
    0,   0,   0,
  ]);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    colorsValues,
    gl.STATIC_DRAW
  );
}