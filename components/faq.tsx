"use client";

import gsap from "gsap";
import { useLanguage } from "@/lib/language-context";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const faqs = {
  en: [
    {
      question: "What makes OPCagt different from other agencies?",
      answer:
        "We blend strategic thinking with bold creativity. Unlike traditional agencies, we're a tight-knit team of designers and developers who obsess over every pixel. We don't just deliver projects - we partner with you to create digital experiences that truly move the needle.",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "Most projects range from 6-12 weeks depending on scope. A brand identity might take 4-6 weeks, while a full website redesign with development typically runs 8-12 weeks. We'll provide a detailed timeline during our initial consultation.",
    },
    {
      question: "Do you work with startups or only established brands?",
      answer:
        "We love working with both. Startups bring fresh energy and the chance to build something from scratch. Established brands offer the challenge of evolving while honoring legacy. Whether you're pre-seed or Series C, we adapt our process to fit your stage and budget.",
    },
    {
      question: "Can you help with ongoing design and development needs?",
      answer:
        "Absolutely. Many clients start with a project and transition to a retainer model. Our monthly partnerships include dedicated hours for design updates, new features, A/B testing, and strategic consultation. It's like having an in-house creative team on call.",
    },
    {
      question: "What's your design and development process like?",
      answer:
        "We follow a proven four-phase approach: Discovery (research & strategy), Design (wireframes to high-fidelity), Development (clean, scalable code), and Launch (testing & optimization). You're involved at every milestone with clear deliverables and feedback loops.",
    },
  ],
  zh: [
    {
      question: "OPCagt 与其他机构有什么不同？",
      answer:
        "我们把战略思考与大胆创意结合。不同于传统机构，我们是由设计与开发组成的紧密团队，对每一个像素都较真。我们不只交付项目，更会与你并肩，把数字体验做成真正能带来增长的成果。",
    },
    {
      question: "一个典型项目通常需要多久？",
      answer:
        "大多数项目根据范围在 6-12 周之间。品牌识别通常 4-6 周，完整的网站设计与开发一般 8-12 周。我们会在首次沟通后给出详细排期。",
    },
    {
      question: "你们服务初创公司还是只做成熟品牌？",
      answer:
        "两类我们都很喜欢。初创公司带来从零到一的速度与活力；成熟品牌则更注重在传承中迭代升级。无论你处于早期还是扩张阶段，我们都会按你的阶段和预算定制流程。",
    },
    {
      question: "可以支持持续性的设计和开发需求吗？",
      answer:
        "可以。很多客户先从单次项目开始，再进入长期合作。月度合作通常包含固定工时，用于设计迭代、新功能、A/B 测试和策略支持，相当于你的外部常驻创意团队。",
    },
    {
      question: "你们的设计与开发流程是怎样的？",
      answer:
        "我们采用四阶段方法：发现（调研与策略）、设计（线框到高保真）、开发（干净且可扩展的代码）、上线（测试与优化）。每个里程碑都可见、可审、可反馈。",
    },
  ],
};

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top 90%",
            end: "top 70%",
            scrub: 1,
          },
        }
      );
    }, itemRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={itemRef} className="border border-foreground/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
      >
        <span className="text-lg font-medium text-foreground pr-4">{question}</span>
        <span
          className="relative w-6 h-6 shrink-0 text-foreground transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1.5px] bg-current" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] h-4 bg-current" />
        </span>
      </button>
      <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-foreground/70 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-24 lg:py-32">
      <div className="px-6 sm:px-12 lg:px-24 max-w-4xl mx-auto">
        <h2
          ref={titleRef}
          className="text-4xl lg:text-5xl font-medium tracking-tight text-foreground text-center mb-12 lg:mb-16"
        >
          {lang === "zh" ? (
            <>
              常见问题
              <br />
              解答
            </>
          ) : (
            <>
              Frequently Asked
              <br />
              Questions
            </>
          )}
        </h2>

        <div className="flex flex-col gap-4">
          {faqs[lang].map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
