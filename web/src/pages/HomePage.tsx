import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { SkillCard } from "../components/SkillCard";
import {
  catalog,
  categories,
  searchSkills,
  type CategoryId,
} from "../data/catalog";
import styles from "./HomePage.module.css";

const supportedAssistants = [
  { name: "Claude", icon: "🟣" },
  { name: "Cursor", icon: "⚡" },
  { name: "Windsurf", icon: "🌊" },
  { name: "GitHub Copilot", icon: "🐙" },
  { name: "Gemini CLI", icon: "💎" },
  { name: "Amp", icon: "🔋" },
  { name: "OpenAI Codex", icon: "🤖" },
  { name: "Kiro", icon: "🔮" },
  { name: "Trae", icon: "🎯" },
];

const stats = [
  { label: "Skills", value: 18, icon: "⚡", color: "#8b5cf6" },
  { label: "Agents", value: 8, icon: "🤖", color: "#22d3ee" },
  { label: "Commands", value: 8, icon: "⌘", color: "#34d399" },
  { label: "Rules", value: 6, icon: "📏", color: "#fb923c" },
  { label: "Prompts", value: 5, icon: "💬", color: "#f472b6" },
];

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return count;
}

const pkgManagers = [
  { id: "pnpm", label: "pnpm", command: "pnpm dlx personal-ai-skills" },
  { id: "npm", label: "npm", command: "npx personal-ai-skills" },
  { id: "yarn", label: "yarn", command: "yarn dlx personal-ai-skills" },
] as const;

function PackageManagerTabs() {
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const current = pkgManagers[active];

  // Update slider position when active tab changes
  useEffect(() => {
    const el = tabRefs.current[active];
    if (el) {
      const parent = el.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setSliderStyle({
          transform: `translateX(${elRect.left - parentRect.left}px)`,
          width: `${elRect.width}px`,
        });
      }
    }
  }, [active]);

  const handleTabClick = (index: number) => {
    if (index === active) return;
    setPrevActive(active);
    setIsAnimating(true);
    setActive(index);
    setTimeout(() => setIsAnimating(false), 250);
  };

  return (
    <div className={styles.pmTabs}>
      <div className={styles.pmTabBar}>
        <span className={styles.pmSlider} style={sliderStyle} />
        {pkgManagers.map((pm, i) => (
          <button
            key={pm.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            className={`${styles.pmTab} ${i === active ? styles.pmTabActive : ""}`}
            onClick={() => handleTabClick(i)}
          >
            {pm.label}
          </button>
        ))}
      </div>
      <div className={styles.pmCommand}>
        <span className={styles.commandPrefix}>$</span>
        <span className={styles.commandAnimWrap}>
          {isAnimating && (
            <code
              className={`${styles.command} ${styles.commandExit}`}
              key={`exit-${prevActive}`}
            >
              {pkgManagers[prevActive].command}
            </code>
          )}
          <code
            className={`${styles.command} ${isAnimating ? styles.commandEnter : ""}`}
            key={`enter-${active}`}
          >
            {current.command}
          </code>
        </span>
        <button
          className={styles.commandCopy}
          onClick={async (e) => {
            const text = current.command;
            const btn = e.currentTarget;
            try {
              await navigator.clipboard.writeText(text);
            } catch {
              // Fallback for non-HTTPS or older browsers
              const ta = document.createElement("textarea");
              ta.value = text;
              ta.style.position = "fixed";
              ta.style.opacity = "0";
              document.body.appendChild(ta);
              ta.select();
              document.execCommand("copy");
              document.body.removeChild(ta);
            }
            btn.textContent = "✓ Copied";
            btn.classList.add(styles.commandCopied);
            setTimeout(() => {
              btn.textContent = "Copy";
              btn.classList.remove(styles.commandCopied);
            }, 1500);
          }}
        >
          Copy
        </button>
      </div>
    </div>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[number];
  index: number;
}) {
  const count = useCountUp(stat.value, 1200, 800 + index * 150);
  return (
    <div
      className={styles.statCard}
      style={
        {
          animationDelay: `${700 + index * 100}ms`,
          "--card-color": stat.color,
        } as React.CSSProperties
      }
    >
      <span className={styles.statIcon}>{stat.icon}</span>
      <span className={styles.statValue}>{count}+</span>
      <span className={styles.statLabel}>{stat.label}</span>
    </div>
  );
}

export function HomePage() {
  const [search, setSearch] = useState("");

  const filteredSkills = search ? searchSkills(search) : catalog;
  const recentSkills = catalog.slice(0, 6);

  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty(
        "--mouse-x",
        `${e.clientX - rect.left}px`,
      );
      e.currentTarget.style.setProperty(
        "--mouse-y",
        `${e.clientY - rect.top}px`,
      );
    },
    [],
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroOrb1} aria-hidden="true" />
        <div className={styles.heroOrb2} aria-hidden="true" />
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          Open-source &middot; Free forever
        </div>
        <h1 className={styles.title}>
          Teach Your AI
          <br />
          <span className={styles.gradient}>Best Practices</span>
        </h1>
        <p className={styles.subtitle}>
          One command installs skills, agents, commands, rules & prompts across
          every AI assistant you use — Claude, Copilot, Cursor, Gemini & more.
        </p>
        <div className={styles.assistants}>
          {supportedAssistants.map((a, i) => (
            <span
              key={a.name}
              className={styles.assistant}
              title={a.name}
              style={{ animationDelay: `${600 + i * 80}ms` }}
            >
              {a.icon}
            </span>
          ))}
        </div>
        <div className={styles.cta}>
          <PackageManagerTabs />
        </div>

        <div className={styles.stats}>
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </section>

      <section className={styles.search}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>⌘</span>
          <input
            type="text"
            placeholder="Search skills, agents, commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button
              className={styles.searchClear}
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>
      </section>

      {search ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Search Results
            <span className={styles.sectionCount}>{filteredSkills.length}</span>
          </h2>
          <div className={styles.grid}>
            {filteredSkills.map((skill, i) => (
              <SkillCard key={skill.id} skill={skill} index={i} />
            ))}
          </div>
          {filteredSkills.length === 0 && (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🔍</span>
              <p>No skills found matching &ldquo;{search}&rdquo;</p>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className={styles.categories}>
            {(
              Object.entries(categories) as [
                CategoryId,
                (typeof categories)[CategoryId],
              ][]
            ).map(([id, cat], i) => (
              <Link
                key={id}
                to={`/${id}`}
                className={styles.categoryCard}
                style={{ animationDelay: `${i * 80}ms` }}
                onMouseMove={handleCardMouseMove}
              >
                <span className={styles.chromaBorder} aria-hidden="true" />
                <span className={styles.categorySpotlight} aria-hidden="true" />
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <h3 className={styles.categoryName}>{cat.name}</h3>
                <p className={styles.categoryDesc}>{cat.description}</p>
                <span className={styles.categoryArrow}>→</span>
              </Link>
            ))}
          </section>

          <Link to="/explore" className={styles.exploreCallout}>
            <span className={styles.exploreIcon}>🧭</span>
            <div>
              <span className={styles.exploreTitle}>
                Explore the full catalog
              </span>
              <span className={styles.exploreDesc}>
                Deep-dive into all 45 templates with examples, before/after
                comparisons, and best practices
              </span>
            </div>
            <span className={styles.exploreArrow}>→</span>
          </Link>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured Skills</h2>
              <Link to="/skills" className={styles.viewAll}>
                View all
                <span className={styles.viewAllArrow}>→</span>
              </Link>
            </div>
            <div className={styles.grid}>
              {recentSkills.map((skill, i) => (
                <SkillCard key={skill.id} skill={skill} index={i} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
