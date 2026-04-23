---
name: ios-hig
description: Apply Apple's Human Interface Guidelines to iOS app design — navigation patterns, controls, typography, spacing, and platform conventions. Use when designing iOS apps, reviewing SwiftUI/UIKit code, or when the user mentions "iOS design", "Apple guidelines", "HIG", "SwiftUI UI", or "feels like a native app".
category: design
tags: [ios, apple, hig, swiftui, uikit, mobile, native, design-system]
---

# Skill: iOS HIG Design

Apply Apple's Human Interface Guidelines to produce native-feeling iOS interfaces. Every decision references HIG conventions — not Material Design, not web patterns.

## Core Principles (HIG)

Apple's three foundational qualities:
1. **Clarity** — Text is legible, icons precise, functionality is obvious
2. **Deference** — UI defers to content; chrome stays out of the way
3. **Depth** — Realistic motion and layers communicate hierarchy

## Navigation Patterns

### Correct patterns by use case:

| Use Case | Pattern | Component |
|---------|---------|-----------|
| Top-level sections | Tab bar (max 5) | `TabView` |
| Hierarchical content | Navigation stack | `NavigationStack` |
| Supplementary content | Modal / sheet | `.sheet()`, `.fullScreenCover()` |
| Contextual actions | Context menu | `.contextMenu()` |
| Settings | Push navigation | `NavigationLink` |

```swift
// ✅ Tab bar for top-level — never push between tabs
TabView {
    FeedView().tabItem { Label("Home", systemImage: "house") }
    SearchView().tabItem { Label("Search", systemImage: "magnifyingglass") }
    ProfileView().tabItem { Label("Profile", systemImage: "person") }
}

// ✅ Sheet for supplementary — not full navigation replacement
.sheet(isPresented: $showCompose) {
    ComposeView()
}
```

### Anti-patterns:
- ❌ Navigation bar in a modal (modals are self-contained)
- ❌ More than 5 tab bar items (use "More" pattern or reconsider IA)
- ❌ Pushing a settings screen as a modal
- ❌ Custom back button that doesn't swipe-to-go-back

## Typography (SF Pro)

Always use Dynamic Type — never hardcode sizes:

```swift
// ✅ HIG-compliant — scales with accessibility settings
Text("Title").font(.largeTitle)       // 34pt
Text("Heading").font(.title)          // 28pt
Text("Body").font(.body)              // 17pt
Text("Caption").font(.caption)        // 12pt

// ❌ Never hardcode
Text("Title").font(.system(size: 34)) // breaks Dynamic Type
```

**Text styles and their uses:**

| Style | Size | Use |
|-------|------|-----|
| `.largeTitle` | 34 | Screen titles (navigation bar) |
| `.title` | 28 | Section headers |
| `.title2` | 22 | Sub-section headers |
| `.headline` | 17 semibold | Emphasized body content |
| `.body` | 17 | Primary content |
| `.callout` | 16 | Secondary body content |
| `.footnote` | 13 | Fine print |
| `.caption` | 12 | Image captions, timestamps |

## Spacing & Layout

HIG uses 8pt grid — all spacing is multiples of 8 (or 4 for micro gaps):

```swift
// Standard spacing constants
struct Spacing {
    static let xxs: CGFloat = 4
    static let xs:  CGFloat = 8
    static let sm:  CGFloat = 12
    static let md:  CGFloat = 16  // default margin
    static let lg:  CGFloat = 24
    static let xl:  CGFloat = 32
    static let xxl: CGFloat = 48
}

// Safe area insets — always respect them
.safeAreaInset(edge: .bottom) { ... }
```

**Standard margins:**
- Content: 16pt from screen edge
- Cards: 16pt internal padding
- List rows: 16pt leading, 16pt trailing
- Section headers: 20pt from top of section

## Controls

### Buttons
```swift
// ✅ Primary CTA — filled, full width at bottom
Button("Create Account") { }
    .buttonStyle(.borderedProminent)
    .controlSize(.large)
    .frame(maxWidth: .infinity)

// ✅ Destructive — always labeled and confirmed
Button("Delete", role: .destructive) { showConfirm = true }

// ❌ Custom button that looks like native but isn't
// Always prefer buttonStyle(.bordered) or .borderedProminent
```

### Lists
```swift
// ✅ Use List for tappable rows — automatic swipe actions, context menus
List(items) { item in
    NavigationLink(value: item) {
        ItemRow(item: item)
    }
}
.listStyle(.insetGrouped)

// ❌ Don't use VStack+ForEach for tappable lists
```

### Alerts & Confirmations
```swift
// ✅ Alert for destructive confirmation
.alert("Delete Note?", isPresented: $showAlert) {
    Button("Delete", role: .destructive) { delete() }
    Button("Cancel", role: .cancel) { }
} message: {
    Text("This cannot be undone.")
}
```

## SF Symbols

Always prefer SF Symbols over custom icons:

```swift
// Use semantic names, not random picks
Image(systemName: "house")           // Home tab
Image(systemName: "magnifyingglass") // Search
Image(systemName: "plus")            // Add / create
Image(systemName: "ellipsis")        // More options
Image(systemName: "trash")           // Delete
Image(systemName: "square.and.arrow.up") // Share
Image(systemName: "gear")            // Settings
Image(systemName: "bell")            // Notifications
Image(systemName: "checkmark")       // Confirm
Image(systemName: "xmark")           // Dismiss
```

Match weight to context:
```swift
Image(systemName: "star.fill")
    .symbolRenderingMode(.multicolor)
    .imageScale(.large)
    .fontWeight(.semibold)
```

## Color

```swift
// ✅ Always use semantic colors — they adapt to dark mode automatically
Color.primary           // Main text
Color.secondary         // Secondary text
Color.accentColor       // App tint (set in asset catalog)
Color(UIColor.systemBackground)  // Main background
Color(UIColor.secondarySystemBackground)  // Cards, grouped rows
Color(UIColor.systemGroupedBackground)    // Grouped table bg

// ❌ Never hardcode light-mode colors
Color(#colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)) // breaks dark mode
```

## Rules

- ✅ DO: Use Dynamic Type — never hardcode font sizes
- ✅ DO: Respect safe areas — never clip content behind home indicator or notch
- ✅ DO: Support dark mode — use semantic colors only
- ✅ DO: Use SF Symbols instead of custom icons where available
- ✅ DO: Follow tab bar / navigation stack conventions — users expect them
- ❌ DON'T: Build custom UI for things that have native components (alerts, sheets, pickers)
- ❌ DON'T: Use web patterns (hamburger menu, floating action button on iOS)
- ❌ DON'T: Hardcode frame sizes — use flexible layouts that work across screen sizes
- ❌ DON'T: Add animations that conflict with system transitions
