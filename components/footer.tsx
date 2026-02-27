"use client";

import { useLanguage } from "@/lib/language-context";
import Link from "next/link";

const socialLinks = [
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter", href: "https://twitter.com" },
];

export function Footer() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  const navLinks = isZh
    ? [
        { label: "首页", href: "#" },
        { label: "案例", href: "#projects" },
        { label: "服务", href: "#services" },
        { label: "关于", href: "#about" },
        { label: "联系", href: "#contact" },
      ]
    : [
        { label: "Home", href: "#" },
        { label: "Work", href: "#projects" },
        { label: "Services", href: "#services" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
      ];

  const footerLinks = isZh
    ? [
        { label: "关于我们", href: "#about" },
        { label: "我们的案例", href: "#projects" },
        { label: "联系", href: "#contact" },
      ]
    : [
        { label: "About Us", href: "#about" },
        { label: "Our Work", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ];

  return (
    <footer id="contact" className="lg:sticky lg:bottom-0 lg:z-0 bg-foreground text-background">
      <div className="px-6 sm:px-12 lg:px-24 pt-24 lg:pt-32 pb-16 lg:pb-24 text-center sm:text-left max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
        <a
          href="mailto:hello@OPCagt.studio"
          className="text-2xl sm:text-5xl lg:text-7xl font-medium tracking-tight hover:opacity-80 transition-opacity break-all sm:break-normal"
        >
          hello@OPCagt.com
        </a>

        <div className="mt-10">
          <Link
            href="mailto:hello@OPCagt.com"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-background text-foreground hover:bg-background/90 transition-colors"
          >
            {isZh ? "开始新项目" : "Start New Project"}
          </Link>
        </div>
      </div>

      <div className="px-6 sm:px-12 lg:px-24 max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
        <div className="border-t border-background/10" />
      </div>

      <div className="px-6 sm:px-12 lg:px-24 py-16 lg:py-24 max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          <div>
            <span className="text-4xl font-medium tracking-tight">OPCagt</span>
            <p className="mt-4 text-background/60 text-4xl">{isZh ? "为进化想法而生。" : "Built to evolve ideas."}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-16 lg:gap-24">
            <div>
              <h4 className="text-sm font-medium text-background/60 mb-6">{isZh ? "地点" : "Location"}</h4>
              <div className="mb-6">
                <p className="font-medium mb-1">{isZh ? "全球" : "Worldwide"}</p>
                <p className="text-background/60 text-sm">{isZh ? "100% 远程团队" : "100% Remote Team"}</p>
              </div>
              <div>
                <p className="font-medium mb-1">{isZh ? "中国" : "China"}</p>
                <p className="text-background/60 text-sm">
                  {isZh ? "江苏 南京" : "Nanjing, Jiangsu"}
                  <br />
                  {isZh ? "江苏 苏州" : "Suzhou, Jiangsu"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-background/60 mb-6">{isZh ? "服务" : "Services"}</h4>
              <ul className="space-y-3">
                <li><span className="text-background">{isZh ? "网页设计" : "Web Design"}</span></li>
                <li><span className="text-background">{isZh ? "开发" : "Development"}</span></li>
                <li><span className="text-background">{isZh ? "品牌" : "Branding"}</span></li>
                <li><span className="text-background">{isZh ? "策略" : "Strategy"}</span></li>
                <li><span className="text-background">{isZh ? "动效" : "Motion"}</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-background/60 mb-6">{isZh ? "导航" : "Navigation"}</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-background hover:text-background/60 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-background/60 mb-6">{isZh ? "社交" : "Social"}</h4>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-background hover:text-background/60 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-12 lg:px-24 py-6 max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-background/60 hover:text-background transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-sm text-background/40">
            {isZh ? "© 2026 OPCagt - 保留所有权利" : "© 2026 OPCagt - All rights reserved"}
          </p>

          <p className="text-sm text-background/40">
            {isZh ? "由 Dr Houzhi Wang 用心打造" : "Created with passion by Dr Houzhi Wang"}
          </p>
        </div>
      </div>
    </footer>
  );
}
