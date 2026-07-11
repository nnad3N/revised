precision highp float;

uniform sampler2D uImage;
uniform vec2 uLensCenter;
uniform float uLensSize;
uniform float uBezelWidth;
uniform float uZoom;
uniform float uRefraction;
uniform float uPress;
uniform float uLightAngle;

varying vec2 vUv;

float circleSdf(vec2 point, float radius) {
  return length(point) - radius;
}

vec2 circleNormal(vec2 point) {
  return point / max(length(point), 0.00001);
}

vec2 rotate(vec2 point, float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return mat2(cosine, -sine, sine, cosine) * point;
}

void main() {
  vec2 point = vUv - uLensCenter;
  float lift = clamp(uPress, 0.0, 1.0);
  float radius = uLensSize * 0.5 * (1.0 + lift * 0.035);
  float sdf = circleSdf(point, radius);
  float inside = 1.0 - smoothstep(-0.0015, 0.0015, sdf);

  vec4 base = texture2D(uImage, vUv);

  // The key light is above-left, so both shadows are biased toward the
  // bottom-right. The short offset keeps the pickup feeling close to the
  // painting instead of making the lens appear to float high above it.
  vec2 shadowDirection = rotate(normalize(vec2(0.72, -0.70)), uLightAngle);
  vec2 shadowOffset = shadowDirection * mix(0.007, 0.016, lift);
  float shadowSpread = mix(0.001, 0.004, lift);
  float shadowSoftness = mix(0.013, 0.024, lift);
  float shadowSdf = circleSdf(point - shadowOffset, radius + shadowSpread);
  float shadowSide = smoothstep(
    -0.35,
    0.25,
    dot(circleNormal(point), shadowDirection)
  );
  float castShadow =
    (1.0 - smoothstep(-0.001, shadowSoftness, shadowSdf)) *
    (1.0 - inside) *
    shadowSide;

  vec2 contactOffset = shadowDirection * 0.004;
  float contactSdf = circleSdf(point - contactOffset, radius + 0.001);
  float contactSide = smoothstep(
    -0.65,
    0.35,
    dot(circleNormal(point), shadowDirection)
  );
  float contactShadow =
    (1.0 - smoothstep(-0.001, 0.008, contactSdf)) *
    (1.0 - inside) *
    (1.0 - lift) *
    contactSide;

  base.rgb *= 1.0 - castShadow * mix(0.27, 0.20, lift);
  base.rgb *= 1.0 - contactShadow * 0.12;

  vec2 normal = circleNormal(point);
  float bevelDepth = -sdf;
  float bevelJoinSoftness = max(0.0012, uBezelWidth * 0.08);

  // A flat face meeting a ground, planar bevel has a real crease: the surface
  // normal changes over a very short distance at the join. Keep the bevel
  // planar, then antialias only that join instead of rounding it into the face.
  float bevel = inside * (
    1.0 - smoothstep(
      uBezelWidth - bevelJoinSoftness,
      uBezelWidth + bevelJoinSoftness,
      bevelDepth
    )
  );
  float activeZoom = uZoom + uPress * 0.08;
  float activeRefraction = uRefraction * (1.0 + uPress * 0.32);

  vec2 magnifiedUv = uLensCenter + point / activeZoom;
  vec2 refractedUv = magnifiedUv - normal * bevel * activeRefraction;
  refractedUv = clamp(refractedUv, vec2(0.001), vec2(0.999));

  // Only the angled bevel noticeably disperses the image; the parallel flat
  // faces remain clear and unobstructed.
  float aberration = bevel * (0.00075 + uPress * 0.0002);
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

  // The face is flat, so it does not carry a painted-on reflection. The angled
  // bevel alone catches the top-left key light and darkens slightly opposite it.
  vec2 lightDirection = -shadowDirection;
  float towardLight = max(dot(normal, lightDirection), 0.0);
  float awayFromLight = max(dot(normal, -lightDirection), 0.0);
  float bevelHighlight = pow(towardLight, 5.0) * bevel;
  float bevelShade = pow(awayFromLight, 2.0) * bevel;

  glass = mix(glass, vec3(0.82, 0.91, 1.0), bevel * 0.025);
  glass += vec3(1.0, 0.985, 0.95) * bevelHighlight * 0.30;
  glass *= 1.0 - bevelShade * 0.055;

  gl_FragColor = vec4(mix(base.rgb, glass, inside), 1.0);
}
