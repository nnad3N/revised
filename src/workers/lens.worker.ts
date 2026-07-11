/// <reference lib="webworker" />

import fragmentShader from "../shaders/lens.frag.glsl?raw";
import vertexShader from "../shaders/lens.vert.glsl?raw";

interface LensValues {
  centerX: number;
  centerY: number;
  lensSize: number;
  bezelWidth: number;
  zoom: number;
  refraction: number;
  press: number;
  glintProgress: number;
}

interface InitMessage extends LensValues {
  type: "init";
  canvas: OffscreenCanvas;
  textureSrc: string;
  size: number;
}

interface RenderMessage extends LensValues {
  type: "render";
}

interface ResizeMessage {
  type: "resize";
  size: number;
}

type LensMessage = InitMessage | RenderMessage | ResizeMessage;

interface Uniforms {
  lensCenter: WebGLUniformLocation;
  lensSize: WebGLUniformLocation;
  bezelWidth: WebGLUniformLocation;
  zoom: WebGLUniformLocation;
  refraction: WebGLUniformLocation;
  press: WebGLUniformLocation;
  glintProgress: WebGLUniformLocation;
}

let canvas: OffscreenCanvas;
let gl: WebGLRenderingContext;
let program: WebGLProgram;
let uniforms: Uniforms;
let values: LensValues;
let ready = false;

const compileShader = (
  context: WebGLRenderingContext,
  type: number,
  source: string,
) => {
  const shader = context.createShader(type);
  if (!shader) throw new Error("Could not create WebGL shader");

  context.shaderSource(shader, source);
  context.compileShader(shader);

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    const message = context.getShaderInfoLog(shader) ?? "Unknown shader error";
    context.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
};

const createProgram = (context: WebGLRenderingContext) => {
  const nextProgram = context.createProgram();
  if (!nextProgram) throw new Error("Could not create WebGL program");

  const vertex = compileShader(context, context.VERTEX_SHADER, vertexShader);
  const fragment = compileShader(
    context,
    context.FRAGMENT_SHADER,
    fragmentShader,
  );
  context.attachShader(nextProgram, vertex);
  context.attachShader(nextProgram, fragment);
  context.linkProgram(nextProgram);
  context.deleteShader(vertex);
  context.deleteShader(fragment);

  if (!context.getProgramParameter(nextProgram, context.LINK_STATUS)) {
    const message =
      context.getProgramInfoLog(nextProgram) ?? "Unknown link error";
    context.deleteProgram(nextProgram);
    throw new Error(message);
  }

  return nextProgram;
};

const getUniform = (
  context: WebGLRenderingContext,
  nextProgram: WebGLProgram,
  name: string,
) => {
  const location = context.getUniformLocation(nextProgram, name);
  if (!location) throw new Error(`Missing WebGL uniform: ${name}`);
  return location;
};

const render = () => {
  if (!ready) return;

  gl.useProgram(program);
  gl.uniform2f(uniforms.lensCenter, values.centerX, 1 - values.centerY);
  gl.uniform1f(uniforms.lensSize, values.lensSize);
  gl.uniform1f(uniforms.zoom, values.zoom);
  gl.uniform1f(uniforms.bezelWidth, values.bezelWidth);
  gl.uniform1f(uniforms.refraction, values.refraction);
  gl.uniform1f(uniforms.press, values.press);
  gl.uniform1f(uniforms.glintProgress, values.glintProgress);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

const initialize = async (message: InitMessage) => {
  canvas = message.canvas;
  canvas.width = message.size;
  canvas.height = message.size;
  values = message;

  const context = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    powerPreference: "high-performance",
  });
  if (!context) return;

  gl = context;
  program = createProgram(gl);
  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const response = await fetch(message.textureSrc);
  const image = await createImageBitmap(await response.blob(), {
    imageOrientation: "flipY",
  });
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  image.close();

  gl.uniform1i(getUniform(gl, program, "uImage"), 0);
  uniforms = {
    lensCenter: getUniform(gl, program, "uLensCenter"),
    lensSize: getUniform(gl, program, "uLensSize"),
    bezelWidth: getUniform(gl, program, "uBezelWidth"),
    zoom: getUniform(gl, program, "uZoom"),
    refraction: getUniform(gl, program, "uRefraction"),
    press: getUniform(gl, program, "uPress"),
    glintProgress: getUniform(gl, program, "uGlintProgress"),
  };

  gl.viewport(0, 0, canvas.width, canvas.height);
  ready = true;
  render();
  self.postMessage({ type: "ready" });
};

self.addEventListener("message", (event: MessageEvent<LensMessage>) => {
  const message = event.data;

  if (message.type === "init") {
    void initialize(message);
    return;
  }

  if (message.type === "resize") {
    if (canvas.width === message.size && canvas.height === message.size) return;

    canvas.width = message.size;
    canvas.height = message.size;
    if (ready) {
      gl.viewport(0, 0, message.size, message.size);
      render();
    }
    return;
  }

  values = message;
  render();
});
