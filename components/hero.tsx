"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLanguage } from "@/lib/language-context";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const fragmentShader = `
uniform float iTime,isDark,iScroll;
uniform vec2 iResolution;
uniform vec3 color1Start,color2Start,color3Start,color1End,color2End,color3End;
#define W vec3(1)
#define D .08
#define O1 vec2(D*.25,0)
#define O2 vec2(.015,.005)
#define O3 vec2(D*.5,.015)
float h(float n){return fract(sin(n)*43758.5453123);}
float wave(vec2 p,float d,float o){return 1.-smoothstep(0.,d,distance(p.x,.5+sin(o+p.y*3.)*.15));}
vec3 cols(float s){return vec3(0);}
vec4 bD(vec2 p,float o,float s){
  vec3 c1=mix(color1Start,color1End,s),c2=mix(color2Start,color2End,s),c3=mix(color3Start,color3End,s);
  return vec4(c1*wave(p+O1,D,o)+c2*wave(p-O2,D,o)+c3*wave(p-O3,D,o),1);
}
vec4 bDG(vec2 p,float o,float s){
  vec3 c1=mix(color1Start,color1End,s),c2=mix(color2Start,color2End,s),c3=mix(color3Start,color3End,s);
  float d=D*2.5;
  return vec4(c1*wave(p+O1,d,o)+c2*wave(p-O2,d,o)+c3*wave(p-O3,d,o),1);
}
vec4 bL(vec2 p,float o,float s){
  vec3 c1=mix(color1Start,color1End,s),c2=mix(color2Start,color2End,s),c3=mix(color3Start,color3End,s);
  return vec4(mix(W,c1,wave(p+O1,D,o))*mix(W,c2,wave(p-O2,D,o))*mix(W,c3,wave(p-O3,D,o)),1);
}
vec4 bLG(vec2 p,float o,float s){
  vec3 c1=mix(color1Start,color1End,s),c2=mix(color2Start,color2End,s),c3=mix(color3Start,color3End,s);
  float d=D*2.5;
  return vec4(mix(W,c1,wave(p+O1,d,o))*mix(W,c2,wave(p-O2,d,o))*mix(W,c3,wave(p-O3,d,o)),1);
}
vec2 rot(vec2 p,float a){float s=sin(a),c=cos(a);return vec2(p.x*c-p.y*s,p.x*s+p.y*c);}
float crt(vec2 u,float t){
  float sc=.95+.05*sin((u.y+t*.05)*iResolution.y*1.5);
  float fl=.99+.01*sin(t*8.);
  vec2 ct=u-vec2(iResolution.x/iResolution.y*.5,.5);
  return sc*fl*(1.-dot(ct,ct)*.15);
}
float ease(float t){float m=1.-t;return 1.-m*m*m*m;}
float prog(float i,float t){return ease(clamp((t-i*.2)/3.5,0.,1.));}
float mask(vec2 p,float pr){float th=mix(2.5,-1.,(p.x+p.y)*.5);return smoothstep(mix(2.5,-1.,pr)-.4,mix(2.5,-1.,pr),(p.x+p.y)*.5);}
float beam(float y,float t,float i){
  float sp=.08+h(i*7.3)*.06,ph=h(i*13.7)*10.,by=fract(t*sp+ph),dw=min(abs(y-by),1.-abs(y-by));
  return exp(-dw*dw*25.)*.8;
}
void main(){
  vec2 uv=gl_FragCoord.xy/iResolution.y,su=gl_FragCoord.xy/iResolution.xy;
  
  // === WAVE SCALE (larger = waves appear smaller/zoomed out) ===
  float sc=1.1;
  
  float ar=iResolution.x/iResolution.y;
  
  // === LEFT/RIGHT OFFSET (larger = waves move more to the right) ===
  float xOffset=0.7;
  
  uv=uv*sc-vec2(ar*xOffset*sc,.5*sc);
  uv=rot(uv,radians(mix(-55.,-120.,iScroll)));
  uv.y+=.5*sc;
  float bf=smoothstep(0.,.25,su.y),t=iTime*.1;
  float p1=prog(0.,iTime),p2=prog(1.,iTime),p3=prog(2.,iTime);
  float m1=mask(uv,p1),m2=mask(uv+vec2(.3,0),p2),m3=mask(uv+vec2(.6,0),p3);
  float cr=crt(su,iTime);
  float b1=beam(su.y,iTime,0.),b2=beam(su.y,iTime,1.),b3=beam(su.y,iTime,2.);
  vec2 u2=uv+vec2(.3,0),u3=uv+vec2(.6,0);
  if(isDark>.5){
    vec4 w1=bD(uv,t,iScroll)*m1,w2=bD(u2,t,iScroll)*m2,w3=bD(u3,t,iScroll)*m3;
    float l1=min(1.,w1.r+w1.g+w1.b),l2=min(1.,w2.r+w2.g+w2.b),l3=min(1.,w3.r+w3.g+w3.b);
    w1.rgb+=vec3(1,.9,.95)*b1*l1;w2.rgb+=vec3(.9,.85,1)*b2*l2;w3.rgb+=vec3(.85,.9,1)*b3*l3;
    vec4 wv=(w1+w2+w3)*.5;
    vec4 g1=bDG(uv,t,iScroll)*m1,g2=bDG(u2,t,iScroll)*m2,g3=bDG(u3,t,iScroll)*m3;
    vec4 gl=(g1+g2+g3)*.5;
    vec3 fc=wv.rgb+gl.rgb*.35;
    float wi=min(1.,wv.r+wv.g+wv.b),gi=min(1.,gl.r+gl.g+gl.b);
    float a=smoothstep(0.,.15,gi)*smoothstep(.05,.4,wi+gi*.5)*bf;
    fc*=mix(1.,cr,smoothstep(0.,.5,wi));
    gl_FragColor=vec4(fc,a);
  }else{
    vec4 r1=bL(uv,t,iScroll),r2=bL(u2,t,iScroll),r3=bL(u3,t,iScroll);
    vec3 w1=mix(W,r1.rgb,m1),w2=mix(W,r2.rgb,m2),w3=mix(W,r3.rgb,m3);
    float l1=1.-r1.r*r1.g*r1.b,l2=1.-r2.r*r2.g*r2.b,l3=1.-r3.r*r3.g*r3.b;
    w1=mix(w1,W,b1*l1*.5);w2=mix(w2,W,b2*l2*.5);w3=mix(w3,W,b3*l3*.5);
    vec3 wv=w1*w2*w3;
    vec4 g1=bLG(uv,t,iScroll),g2=bLG(u2,t,iScroll),g3=bLG(u3,t,iScroll);
    vec3 gl=mix(W,g1.rgb,m1)*mix(W,g2.rgb,m2)*mix(W,g3.rgb,m3);
    vec3 fc=mix(wv,gl,.2);
    fc*=mix(1.,cr,1.-fc.r*fc.g*fc.b);
    fc=mix(W,fc,bf);
    gl_FragColor=vec4(fc,1);
  }
}
`;

const vertexShader = `
void main() {
    gl_Position = vec4(position, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result && result[1] && result[2] && result[3]) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  return [1, 1, 1];
}

interface ColorSet {
  color1: string;
  color2: string;
  color3: string;
}

interface ShaderPlaneProps {
  isDark: boolean;
  startColors: ColorSet;
  endColors: ColorSet;
}

function ShaderPlane({ isDark, startColors, endColors }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, gl } = useThree();
  const defaultStart = { color1: "#FF66B2", color2: "#994DE6", color3: "#4D80FF" };
  const defaultEnd = { color1: "#FF8026", color2: "#FF4059", color3: "#FF73A6" };

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(window.innerWidth * Math.min(window.devicePixelRatio, 0.5), window.innerHeight * Math.min(window.devicePixelRatio, 0.5)) },
      isDark: { value: 1.0 },
      iScroll: { value: 0.0 },
      color1Start: { value: new THREE.Vector3(...hexToRgb(startColors?.color1 ?? defaultStart.color1)) },
      color2Start: { value: new THREE.Vector3(...hexToRgb(startColors?.color2 ?? defaultStart.color2)) },
      color3Start: { value: new THREE.Vector3(...hexToRgb(startColors?.color3 ?? defaultStart.color3)) },
      color1End: { value: new THREE.Vector3(...hexToRgb(endColors?.color1 ?? defaultEnd.color1)) },
      color2End: { value: new THREE.Vector3(...hexToRgb(endColors?.color2 ?? defaultEnd.color2)) },
      color3End: { value: new THREE.Vector3(...hexToRgb(endColors?.color3 ?? defaultEnd.color3)) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms.isDark) {
        material.uniforms.isDark.value = isDark ? 1.0 : 0.0;
      }
    }
  }, [isDark]);

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      const u = material.uniforms;
      if (u.color1Start && u.color2Start && u.color3Start && u.color1End && u.color2End && u.color3End) {
        u.color1Start.value.set(...hexToRgb(startColors.color1));
        u.color2Start.value.set(...hexToRgb(startColors.color2));
        u.color3Start.value.set(...hexToRgb(startColors.color3));
        u.color1End.value.set(...hexToRgb(endColors.color1));
        u.color2End.value.set(...hexToRgb(endColors.color2));
        u.color3End.value.set(...hexToRgb(endColors.color3));
      }
    }
  }, [startColors, endColors]);

  useEffect(() => {
    const handleScroll = () => {
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        if (material.uniforms.iScroll) {
          const scrollProgress = Math.min(1, window.scrollY / window.innerHeight);
          const eased = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
          material.uniforms.iScroll.value = eased;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (meshRef.current) {
          const material = meshRef.current.material as THREE.ShaderMaterial;
          if (material.uniforms.iResolution) {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            material.uniforms.iResolution.value.set(window.innerWidth * dpr, window.innerHeight * dpr);
          }
        }
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms.iResolution) {
        // Use actual framebuffer size (includes device pixel ratio)
        const drawingBufferSize = gl.getDrawingBufferSize(new THREE.Vector2());
        material.uniforms.iResolution.value.set(drawingBufferSize.x, drawingBufferSize.y);
      }
    }
  }, [size, gl]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms.iTime) {
        material.uniforms.iTime.value = state.clock.elapsedTime;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export interface HeroProps {
  startColors?: { color1?: string; color2?: string; color3?: string };
  endColors?: { color1?: string; color2?: string; color3?: string };
}

const defaultStartColors = {
  color1: "#FF66B2",
  color2: "#994DE6",
  color3: "#4D80FF",
};

const defaultEndColors = {
  color1: "#4D80FF",
  color2: "#994DE6",
  color3: "#FF66B2",
};

export function Hero({ startColors, endColors }: HeroProps = {}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { lang, setLang } = useLanguage();

  const copy =
    lang === "en"
      ? {
          headlineLine1: "The Agent OS for OPCs",
          headlineLine2: "(One-Person Companies)",
          subheadline:
            "Build controlled agent workflows that turn your daily work into repeatable playbooks-track every step, approve the critical ones, and deliver outcomes faster.",
          valueProps: [
            "Controlled by design - approvals, permissions, and guardrails built-in",
            "Playbooks, not prompts - reusable workflows you can run anytime",
            "Traceable outcomes - logs, artifacts, and measurable results",
          ],
          primaryCta: "Get Started / Try the Demo",
          secondaryCta: "View Playbooks / How it Works",
          scroll: "Scroll",
        }
      : {
          headlineLine1: "面向 OPC 的",
          headlineLine2: "智能体操作系统",
          subheadline:
            "把日常工作编排成可控的智能体工作流，沉淀为可复用 Playbook；关键节点人工确认，全程可追踪交付。",
          valueProps: [
            "可控（权限 / 确认 / 护栏）",
            "可复用（Playbook 模板）",
            "可追踪（日志 / 产出 / 指标）",
          ],
          primaryCta: "立即开始",
          secondaryCta: "查看模板库",
          scroll: "下滑",
        };

  const mergedStartColors = {
    color1: startColors?.color1 ?? defaultStartColors.color1,
    color2: startColors?.color2 ?? defaultStartColors.color2,
    color3: startColors?.color3 ?? defaultStartColors.color3,
  };

  const mergedEndColors = {
    color1: endColors?.color1 ?? defaultEndColors.color1,
    color2: endColors?.color2 ?? defaultEndColors.color2,
    color3: endColors?.color3 ?? defaultEndColors.color3,
  };

  return (
    <section id="hero" className="hero relative h-screen w-full bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas
          className="h-full w-full opacity-50 saturate-125 md:opacity-85"
          style={{ pointerEvents: "none" }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 1] }}
          onCreated={({ gl, size }) => {
            gl.setSize(size.width, size.height);
          }}
          resize={{ scroll: false }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <ShaderPlane
            isDark={isDark}
            startColors={mergedStartColors}
            endColors={mergedEndColors}
          />
        </Canvas>
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-360 flex-col justify-start pt-44 px-6 text-left sm:px-12 sm:pt-48 md:justify-center md:pt-0 lg:px-24 2xl:max-w-450 3xl:max-w-550" style={{ perspective: "1200px" }}>
        <div className="mb-6 inline-flex w-fit items-center gap-1 rounded-full border border-foreground/20 bg-background/60 p-1 backdrop-blur">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${lang === "en" ? "bg-foreground text-background" : "text-foreground/80 hover:text-foreground"}`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("zh")}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${lang === "zh" ? "bg-foreground text-background" : "text-foreground/80 hover:text-foreground"}`}
          >
            中文
          </button>
        </div>

        <h1 className="text-[clamp(3rem,8vw,12rem)] leading-[1.05] tracking-tight text-foreground">
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span
              className="block"
              initial={{ y: "120%", rotateX: -90, z: -200, opacity: 0 }}
              animate={{ y: 0, rotateX: 0, z: 0, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              style={{ transformOrigin: "center bottom", transformStyle: "preserve-3d" }}
            >
              {copy.headlineLine1}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span
              className="block"
              initial={{ y: "120%", rotateX: -90, z: -200, opacity: 0 }}
              animate={{ y: 0, rotateX: 0, z: 0, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              style={{ transformOrigin: "center bottom", transformStyle: "preserve-3d" }}
            >
              <em className="font-serif">{copy.headlineLine2}</em>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-8 max-w-md text-[clamp(1.125rem,1.5vw,1.75rem)] leading-relaxed text-foreground/80 lg:max-w-lg 2xl:max-w-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 1.2 }}
        >
          {copy.subheadline}
        </motion.p>

        <motion.ul
          className="mt-6 flex max-w-4xl flex-wrap gap-3 text-sm text-foreground/75 sm:text-base"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 1.35 }}
        >
          {copy.valueProps.map((item) => (
            <li key={item} className="rounded-full border border-foreground/15 bg-background/60 px-4 py-2 backdrop-blur">
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 1.5 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-base font-medium text-background transition-opacity hover:opacity-80"
          >
            {copy.primaryCta}
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center rounded-full border border-foreground/25 bg-background/60 px-6 py-3 text-base font-medium text-foreground transition-colors hover:border-foreground/45"
          >
            {copy.secondaryCta}
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 w-full max-w-360 px-6 sm:px-12 lg:px-24 2xl:max-w-450 3xl:max-w-550"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2 }}
      >
        <span className="text-lg tracking-tight font-medium text-foreground/80">
          {copy.scroll}
        </span>
      </motion.div>
    </section>
  );
}
