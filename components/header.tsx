"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import { useOverlay } from "@/lib/overlay-context";

const sectionIds = ["hero", "projects", "services", "about", "social-proof", "contact"] as const;
type SectionId = (typeof sectionIds)[number];

function getSectionLabel(sectionId: SectionId, lang: "en" | "zh"): string {
  const labels =
    lang === "zh"
      ? {
          hero: "首页",
          projects: "案例",
          services: "服务",
          about: "关于我们",
          "social-proof": "用户评价",
          contact: "联系",
        }
      : {
          hero: "Home",
          projects: "Work",
          services: "Services",
          about: "About us",
          "social-proof": "Testimonials",
          contact: "Contact",
        };

  return labels[sectionId];
}

function getSectionHref(sectionId: SectionId): string {
  if (sectionId === "hero") return "#";
  if (sectionId === "services") return "#services-menu";
  return `#${sectionId}`;
}

export function Header() {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { lang } = useLanguage();
  const { isOverlayOpen } = useOverlay();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      const isNearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100;
      if (isNearBottom) {
        setActiveSection("contact");
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        if (!sectionId || sectionId === "contact") continue;
        const element = document.querySelector(`.${sectionId}`) || document.getElementById(sectionId);
        if (element) {
          const { offsetTop } = element as HTMLElement;
          if (scrollPosition >= offsetTop) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (sectionIds[0]) {
        setActiveSection(sectionIds[0]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {!isOverlayOpen && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-50 px-4 py-6 sm:px-12 sm:py-12 lg:px-24"
        >
      <div className="mx-auto flex max-w-360 items-center justify-between gap-4 2xl:max-w-450 3xl:max-w-550">
        <motion.a
          href="/"
          className="flex h-12 sm:h-16 font-medium tracking-tight text-base sm:text-xl items-center justify-center rounded-xl sm:rounded-2xl text-white bg-neutral-900/70 backdrop-blur-lg px-4 sm:px-5 shadow-lg shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Switch to logo here */}
          {/* <Image
            src="/svg/mock_logo.svg"
            alt="Logo"
            width={120}
            height={20}
          /> */}
          OPCagt
        </motion.a>

        <div className="relative h-12 sm:h-16">
          <motion.div
            className="absolute top-0 right-0 w-48 sm:w-60 bg-neutral-900/70 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              height: isMenuOpen ? "auto" : (isMobile ? 48 : 64),
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 1, 0.36, 1],
              height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-12 sm:h-16 w-full items-center justify-between gap-4 px-4 sm:px-5 text-white"
            >
              <span className="text-base sm:text-lg font-medium">{getSectionLabel(activeSection, lang)}</span>
              <motion.div
                className="relative h-5 w-5 sm:h-6 sm:w-6"
                animate={{ rotate: isMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="absolute left-1/2 top-0 h-5 sm:h-6 w-[1.5px] -translate-x-1/2 bg-current" />
                <span className="absolute left-0 top-1/2 h-[1.5px] w-5 sm:w-6 -translate-y-1/2 bg-current" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                className="px-5 pb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <ul className="flex flex-col gap-1">
                  {sectionIds.map((sectionId, index) => (
                    <motion.li
                      key={sectionId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.05 * index,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <a
                        href={getSectionHref(sectionId)}
                        onClick={() => {
                          setIsMenuOpen(false);
                          setActiveSection(sectionId);
                        }}
                        className={`block py-1.5 text-lg font-medium transition-colors hover:text-white ${
                          activeSection === sectionId
                            ? "text-white underline underline-offset-4" 
                            : "text-white/60"
                        }`}
                      >
                        {getSectionLabel(sectionId, lang)}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.header>
      )}
    </AnimatePresence>
  );
}
