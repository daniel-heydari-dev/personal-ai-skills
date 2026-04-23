---
name: seo
description: Comprehensive SEO analysis and optimization — technical audits, content quality, schema markup, local SEO, and AI search optimization. Use when the user asks to "audit SEO", "improve rankings", "check schema", "optimize for search", or mentions keywords like "SERP", "crawlability", "backlinks", "E-E-A-T".
category: marketing
tags: [seo, search, audit, schema, content, technical-seo, ai-seo, local-seo]
source: https://github.com/AgriciDaniel/claude-seo
---

# Skill: SEO

Full-spectrum SEO analysis and optimization — from technical crawlability to AI search visibility.

## Commands

| Command | Action |
|---------|--------|
| `/seo audit <url>` | Full-site audit (15 parallel agents) |
| `/seo page <url>` | Deep single-page analysis |
| `/seo schema <url>` | Schema.org markup validation + generation |
| `/seo cluster <keyword>` | Semantic keyword clustering |
| `/seo local <url>` | Local business + Google Business Profile audit |
| `/seo geo <url>` | AI search optimization (Overviews, ChatGPT, Perplexity) |
| `/seo drift compare` | Compare current vs baseline |

## Core Analysis Areas

### Technical SEO
- Crawlability: robots.txt, sitemap, canonical tags, redirect chains
- Core Web Vitals: LCP, INP, CLS — target LCP < 2.5s, CLS < 0.1
- Mobile usability, HTTPS, structured data errors
- Internal linking architecture and orphaned pages

### Content Quality (E-E-A-T)
- Experience, Expertise, Authoritativeness, Trustworthiness signals
- Content depth vs competing pages for target keywords
- Duplicate content, thin content detection
- Heading hierarchy, meta description optimization

### Schema Markup
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "...",
  "dateModified": "..."
}
```
Required schemas by page type:
- Homepage → `Organization`, `WebSite`, `SiteNavigationElement`
- Blog post → `Article`, `BreadcrumbList`
- Product → `Product`, `Offer`, `AggregateRating`
- Local business → `LocalBusiness`, `OpeningHoursSpecification`

### AI Search Optimization
- Structure content for AI Overview eligibility (clear H2s, concise answers)
- Add FAQ schema for question-based queries
- Optimize for entity recognition (named entity disambiguation)
- Conversational query coverage

## Rules

- ✅ DO: Run a crawl before making recommendations — data-first
- ✅ DO: Prioritize by impact × effort — quick wins first
- ✅ DO: Report Core Web Vitals with field data, not just lab
- ✅ DO: Validate schema with Google's Rich Results Test
- ❌ DON'T: Recommend doorway pages or thin programmatic content
- ❌ DON'T: Keyword-stuff — E-E-A-T signals matter more than density
- ❌ DON'T: Ignore mobile — mobile-first indexing is the default
- ❌ DON'T: Generate more than 30 location pages without filtering logic

## Output Format

Audit reports include:
1. Executive summary (3–5 critical issues)
2. Scored checklist per category (0–100)
3. Prioritized action items (High / Medium / Low)
4. Code snippets for schema, meta, and structured fixes
