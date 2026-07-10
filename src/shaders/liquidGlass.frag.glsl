uniform sampler2D uImage;
uniform vec2 uLensCenter;
uniform float uLensSize;
uniform float uBezelWidth;
uniform float uZoom;
uniform float uRefraction;
uniform float uPress;

varying vec2 vUv;

float circleSdf(vec2 point, float radius) {
  return length(point) - radius;
}

vec2 circleNormal(vec2 point) {
  return point / max(length(point), 0.00001);
}

void main() {
  vec2 point = vUv - uLensCenter;
  float radius = uLensSize * 0.5;
  float sdf = circleSdf(point, radius);
  float inside = 1.0 - smoothstep(-0.0015, 0.0015, sdf);

  vec4 base = texture2D(uImage, vUv);

  vec2 shadowOffset = vec2(0.008, -0.012);
  float shadowSdf = circleSdf(point - shadowOffset, radius + 0.004);
  float shadow = (1.0 - smoothstep(-0.002, 0.045, shadowSdf)) * (1.0 - inside);
  base.rgb *= 1.0 - shadow * 0.34;

  vec2 normal = circleNormal(point);
  float bezel = inside * (1.0 - smoothstep(0.0, uBezelWidth, -sdf));
  float curvedBezel = pow(bezel, 1.35);
  float activeZoom = uZoom + uPress * 0.08;
  float activeRefraction = uRefraction * (1.0 + uPress * 0.32);

  vec2 magnifiedUv = uLensCenter + point / activeZoom;
  vec2 refractedUv = magnifiedUv - normal * curvedBezel * activeRefraction;
  refractedUv = clamp(refractedUv, vec2(0.001), vec2(0.999));

  float aberration = curvedBezel * (0.0012 + uPress * 0.0004);
  float red = texture2D(
    uImage,
    clamp(refractedUv - normal * aberration, vec2(0.001), vec2(0.999))
  ).r;
  float green = texture2D(uImage, refractedUv).g;
  float blue = texture2D(
    uImage,
    clamp(refractedUv + normal * aberration, vec2(0.001), vec2(0.999))
  ).b;
  vec3 glass = vec3(red, green, blue);

  float glassTint = 0.018 + curvedBezel * 0.035;
  glass = mix(glass, vec3(0.82, 0.91, 1.0), glassTint);

  vec2 lightDirection = normalize(vec2(-0.72, 0.7));
  float directional = max(dot(normal, lightDirection), 0.0);
  float specular = pow(directional, 6.0) * pow(bezel, 1.8);
  float rim = pow(bezel, 4.0);
  glass += vec3(1.0, 0.98, 0.94) * specular * 0.4;
  glass += vec3(0.72, 0.86, 1.0) * rim * 0.12;

  float innerLine = 1.0 - smoothstep(
    0.0,
    uBezelWidth * 0.12,
    abs(-sdf - uBezelWidth * 0.55)
  );
  glass += vec3(1.0) * innerLine * 0.035;

  gl_FragColor = vec4(mix(base.rgb, glass, inside), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
