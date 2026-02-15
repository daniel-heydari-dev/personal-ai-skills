import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { SpaceBackground } from "./SpaceBackground";
import styles from "./Layout.module.css";

const categories = [
  { id: "explore", label: "Explore", icon: "🧭" },
  { id: "guide", label: "Guide", icon: "📘" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "agents", label: "Agents", icon: "🤖" },
  { id: "commands", label: "Commands", icon: "⌘" },
  { id: "rules", label: "Rules", icon: "📏" },
  { id: "prompts", label: "Prompts", icon: "💬" },
];

export function Layout() {
  const location = useLocation();
  const currentCategory = location.pathname.split("/")[1] || "";
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Sliding nav indicator
  useEffect(() => {
    if (!navRef.current) return;
    const activeLink = navRef.current.querySelector(
      `.${styles.active}`,
    ) as HTMLElement | null;
    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicator({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      });
    } else {
      setIndicator(null);
    }
  }, [currentCategory]);

  return (
    <div className={styles.layout}>
      {/* Animated space background */}
      <SpaceBackground />

      {/* Ambient background glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>
            <span className={styles.logoIconInner}>AI</span>
          </span>
          <span className={styles.logoText}>Skills</span>
          <span className={styles.logoBadge}>v1.0</span>
        </Link>
        <nav className={styles.nav} ref={navRef}>
          {indicator && (
            <span
              className={styles.navSlider}
              style={{
                transform: `translateX(${indicator.left}px)`,
                width: `${indicator.width}px`,
              }}
            />
          )}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/${cat.id}`}
              className={`${styles.navLink} ${currentCategory === cat.id ? styles.active : ""}`}
            >
              <span className={styles.navIcon}>{cat.icon}</span>
              <span className={styles.navLabel}>{cat.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <a
            href="https://github.com/daniel-heydari-dev/personal-ai-skills"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.github}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div key={location.pathname} className={styles.pageTransition}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>AI Skills</span>
            <span className={styles.footerTagline}>
              One command. Every assistant.
            </span>
          </div>
          <div className={styles.footerLinks}>
            <a
              href="https://github.com/daniel-heydari-dev/personal-ai-skills"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Source
            </a>
            <span className={styles.footerSep}>·</span>
            <a
              href="https://github.com/daniel-heydari-dev/personal-ai-skills/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Issues
            </a>
            <span className={styles.footerSep}>·</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
