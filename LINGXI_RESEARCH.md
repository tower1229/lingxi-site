# LingXi (灵犀) — Comprehensive Product Research

> Research conducted on 2026-02-26 from [github.com/tower1229/LingXi](https://github.com/tower1229/LingXi)

---

## 1. What is LingXi?

**LingXi (灵犀)** is a **Cursor IDE workflow system with persistent memory**. It is distributed via a **shell install script** that adds structured development workflows and an AI memory system directly into your Cursor IDE environment.

**Tagline (Chinese):** 基于 Cursor 的持久记忆工作流 — "Cursor workflow with persistent memory"

**Vision:** "为创造者打造 AI 时代的专属法宝" — "Your go-to toolkit for creators in the AI era."

### The Problem It Solves

LingXi addresses several key pain points in AI-assisted development:

1. **AI amnesia** — Every new Cursor chat session starts from scratch. The AI forgets your preferences, coding standards, past decisions, and lessons learned. LingXi gives the AI **persistent memory** that survives across sessions.

2. **Lack of structured workflow** — AI coding assistants are powerful but unstructured. LingXi provides a **composable workflow** (requirements → planning → building → review) that brings engineering rigor without rigidity.

3. **Context overload** — AI models get worse when flooded with irrelevant context. LingXi implements **context curation** — retrieving only the most relevant memories and injecting minimal, high-signal information.

4. **Lost institutional knowledge** — Team decisions, code conventions, "don't do X because of Y" — these are lost in chat history. LingXi **captures and reuses** these as structured memory notes.

5. **No human oversight** — AI can make unilateral decisions. LingXi implements **human-in-the-loop gates** at critical decision points.

---

## 2. Target Audience

### Primary Users
- **Software developers** who use **Cursor IDE** as their primary development environment
- **Individual developers** who want their AI assistant to "learn" their preferences and coding style
- **Development teams** who want to standardize workflows and share institutional knowledge across projects

### User Profiles
- **Solo developers** building personal projects who want consistent AI behavior
- **Tech leads / senior developers** who want to encode team standards and architectural decisions
- **Teams transitioning to AI-assisted development** who need structure without losing flexibility
- **Open-source maintainers** who want to document project conventions for AI assistants

### Prerequisites
- Must use **Cursor IDE** (specifically Cursor Nightly for Skills features)
- Some features require Node.js (for hooks and scripts)
- Bilingual: supports both **Chinese and English** (README, commands, docs)

---

## 3. Core Features & Capabilities

### 3.1 Flexible Workflow (可伸缩工作流)

A toolkit of composable commands that follow a software development lifecycle — use all of them for rigorous work, or skip steps for quick tasks:

| Command | Purpose | Output |
|---------|---------|--------|
| `/task` | Create a task document with refined requirements | `001.task.<title>.md` |
| `/vet` | Review the task document (optional, repeatable) | Chat-only feedback |
| `/plan` | Generate task plan + test cases (optional, for complex tasks) | `001.plan.<title>.md` + `001.testcase.<title>.md` |
| `/build` | Execute implementation (plan-driven or req-driven) | Code changes |
| `/review` | Multi-dimensional delivery review | `001.review.<title>.md` |

**Key design choices:**
- **All steps are optional** except `/task` as the entry point
- **No lifecycle management or state routing** — each command works independently
- **Multiple entry points** — experienced developers can jump to any stage
- Works with Cursor's built-in plan mode

### 3.2 Persistent Memory Bank (持久化记忆库)

The flagship feature — a structured system for capturing, storing, retrieving, and applying knowledge across sessions:

| Aspect | Detail |
|--------|--------|
| **What gets stored** | Judgments, preferences, decisions, conventions, debugging paths, anti-patterns ("taste" / 品味) |
| **Storage format** | Flat Markdown files in `.cursor/.lingxi/memory/notes/` |
| **Index** | Single Source of Truth in `memory/INDEX.md` |
| **Write entry** | `/remember <description>` command or automatic capture |
| **Read entry** | Automatic retrieval before every response via `memory-retrieve` |
| **Cross-project** | `memory/notes/share/` directory (git submodule recommended) |

**Memory lifecycle:**
1. **Capture** — via taste-recognition skill (7-field structured payload)
2. **Evaluate** — 5-dimension scoring (decision gain, transferability, trigger-ability, verifiability, stability)
3. **Govern** — semantic deduplication, merge/replace/veto/new decisions
4. **Gate** — human confirmation for merges/replaces; silent writes only for high-confidence new entries
5. **Retrieve** — hybrid semantic + keyword search, top 0-3 results, minimal injection

### 3.3 Human-in-the-Loop (人工门控)

- Key decisions always follow the user's lead
- Memory writes that modify or replace existing entries require explicit user confirmation
- "Optional when you want, never overstepping when you don't"

### 3.4 Context Curation (上下文运营)

- **Pointer-first, detail-later** — reads INDEX first, loads details on demand
- **Minimal high-signal injection** — only injects 0-3 most relevant memories per turn
- **Silent success** — no output when nothing matches ("no news is good news")

### 3.5 Style Fusion (风格融合)

A unique feature that learns and replicates the user's writing style:
- Analyzes text samples to extract style vectors (10 dimensions including sentence length, logic pattern, emotion intensity, vocabulary level, etc.)
- Builds a cumulative style profile via weighted averaging
- Generates writing prompts that match the user's style for documentation

### 3.6 Skill Creator

A meta-skill that guides users through creating new Cursor Agent Skills, following best practices for description writing, progressive disclosure, and directory organization.

### 3.7 Audit System (审计系统)

- 8 hook events captured (prompt submission, agent response, tool use, subagent lifecycle, session events)
- NDJSON format audit log at `.cursor/.lingxi/workspace/audit.log`
- Memory-specific audit events (note created/updated/deleted)
- Session-level correlation via `conversation_id`

---

## 4. Technical Architecture

### 4.1 Component Model

LingXi is built entirely on Cursor's extension points:

```
┌─────────────────────────────────────────────────┐
│ Commands (Entry Points)                          │
│  /task  /plan  /build  /review  /remember  /init │
├─────────────────────────────────────────────────┤
│ Skills (Execution Logic)                         │
│  ┌──────────────────┐  ┌─────────────────────┐  │
│  │ Executor Skills   │  │ Utility Skills      │  │
│  │  task-executor     │  │  about-lingxi       │  │
│  │  plan-executor    │  │  ask-questions       │  │
│  │  build-executor   │  │  skill-creator       │  │
│  │  review-executor  │  │  write-doc           │  │
│  │  vet-executor  │  │  style-fusion        │  │
│  │  workspace-boot   │  │  taste-recognition   │  │
│  └──────────────────┘  └─────────────────────┘  │
│  ┌──────────────────┐  ┌─────────────────────┐  │
│  │ Memory Skills     │  │ Reviewer Skills     │  │
│  │  memory-retrieve  │  │  reviewer-doc-cons  │  │
│  └──────────────────┘  │  reviewer-security  │  │
│                         │  reviewer-perf      │  │
│                         │  reviewer-e2e       │  │
│                         └─────────────────────┘  │
├─────────────────────────────────────────────────┤
│ Subagents (Isolated Context)                     │
│  lingxi-memory (memory write operations)         │
├─────────────────────────────────────────────────┤
│ Hooks (Automation)                               │
│  session-init.mjs (memory inject + conventions)  │
│  lingxi-audit.mjs (8-event audit logging)        │
│  append-memory-audit.mjs (memory event log)      │
├─────────────────────────────────────────────────┤
│ Data Layer                                       │
│  .cursor/.lingxi/                                │
│    tasks/          (task documents)               │
│    memory/         (INDEX + notes + templates)    │
│    workspace/      (audit log, session state)     │
│    style-fusion/   (profile + stats)              │
└─────────────────────────────────────────────────┘
```

### 4.2 Key Design Principles

1. **AI Native** — Use AI for high-semantic, ambiguous tasks; use deterministic mechanisms for standardizable steps. Balance capability release with engineering control.

2. **Silent Success** — Following Linux CLI philosophy: "No news is good news." Minimize output, save tokens, save user attention.

3. **Context Organization** — Pointer-first, detail-later. INDEX as SSoT. Minimal high-signal injection.

4. **Convention over Configuration** — File naming conventions (`001.task.<title>.md`), directory structure conventions, unified index format.

5. **Separation of Concerns** — Commands are pure entry points; Skills carry execution logic; Hooks handle automation; Subagents handle isolated tasks.

6. **Single Source of Truth (SSoT)** — INDEX.md is the authoritative memory index; notes contain the actual content.

### 4.3 Memory System Deep Dive

**Write Path:**
```
User input → taste-recognition skill (7-field payload)
  → lingxi-memory subagent (isolated context)
    → Validate payload
    → Map to note fields (Title, Kind, Status, etc.)
    → Score card (5 dimensions, 0-2 each, total T)
      → T ≤ 3: don't write (low value)
      → T 4-5 + D4≥1: write L0 (factual layer)
      → T 6-7 + D1+D2≥3: write L1 (principle layer)
      → T ≥ 8 + D2≥1 + D4≥1: write both L0+L1
    → Govern (semantic TopK: merge/replace/veto/new)
    → Gate (human confirmation for non-high-confidence)
    → Direct file write (notes/*.md + INDEX.md)
    → Audit log entry
```

**Read Path (every turn):**
```
Session start → hook injects convention
  → Each user message triggers memory-retrieve
    → Understand + refine (semantic summary + keywords)
    → Dual-path search (semantic + keyword)
    → Weighted merge (0.7 semantic + 0.3 keyword)
    → Top 0-3 results → minimal injection
    → Silent if no match
```

**Taste Payload (7 fields):**
```json
{
  "scene": "When referencing Skills in documentation",
  "principles": ["short reference", "full path"],
  "choice": "short reference",
  "evidence": "Don't write full paths",
  "source": "auto|remember|choice|init",
  "confidence": "low|medium|high",
  "apply": "personal|project|team"
}
```

### 4.4 Directory Structure

```
.cursor/
├── commands/              # Command entry points (Markdown)
├── skills/                # Execution logic (SKILL.md + references/)
│   ├── task-executor/
│   ├── plan-executor/
│   ├── build-executor/
│   ├── review-executor/
│   ├── memory-retrieve/
│   ├── taste-recognition/
│   ├── about-lingxi/      # Self-documentation skill
│   ├── style-fusion/      # Writing style learning
│   ├── skill-creator/     # Meta-skill for creating skills
│   └── ...
├── agents/
│   └── lingxi-memory.md   # Memory write subagent
├── hooks/
│   ├── hooks.json          # Hook configuration
│   ├── session-init.mjs    # Session start: inject conventions
│   ├── lingxi-audit.mjs    # 8-event audit logging
│   └── append-memory-audit.mjs
└── .lingxi/
    ├── tasks/              # Task documents (001.task.*.md, etc.)
    ├── memory/
    │   ├── INDEX.md        # SSoT memory index
    │   ├── notes/          # Flat memory files
    │   │   └── share/      # Cross-project shared memories (git submodule)
    │   └── references/     # Templates
    ├── style-fusion/       # Style profile data
    └── workspace/          # Audit log, session state
```

---

## 5. Installation & Quick Start

### Script Install

**Linux / macOS / Git Bash:**
```bash
curl -fsSL https://raw.githubusercontent.com/tower1229/LingXi/main/install/bash.sh | bash
```

**Windows PowerShell:**
```powershell
irm https://raw.githubusercontent.com/tower1229/LingXi/main/install/powershell.ps1 | iex
```

### Quick Start Flow
1. Run `/init` — guided project initialization (collects stack info, patterns, rules)
2. Run `/task <description>` — create your first task document
3. Optionally: `/plan`, `/build`, `/review`
4. Use `/remember` anytime to save learnings

### Cross-Project Knowledge Sharing
```bash
# Add shared memory repo as submodule
git submodule add <shareRepoUrl> .cursor/.lingxi/memory/notes/share

# Sync memory index after adding shared notes
npm run memory-sync
```

---

## 6. What Makes It Unique (Competitive Differentiation)

### vs. Cursor Rules / .cursorrules
| Aspect | Cursor Rules | LingXi |
|--------|-------------|--------|
| Memory | Static, manual | Dynamic, learns from interactions |
| Workflow | None | Full dev lifecycle (task→vet→plan→build→review) |
| Knowledge sharing | Copy-paste between projects | Git submodule shared memory |
| Context management | All-or-nothing | Selective retrieval + minimal injection |

### vs. Custom GPTs / System Prompts
| Aspect | Custom GPTs | LingXi |
|--------|------------|--------|
| Persistence | Session-only | Cross-session, file-based |
| Learning | No | Automatic taste recognition |
| Structure | Freeform | Structured with scoring & governance |
| Human oversight | No | Gated writes with confirmation |

### vs. Other AI Workflow Tools (e.g., Windsurf Flows, Aider)
| Aspect | Others | LingXi |
|--------|--------|--------|
| Memory system | None or basic | Deep: capture→evaluate→govern→gate→retrieve |
| Style learning | None | Style fusion (10-dimension vector) |
| Audit trail | None | Full NDJSON audit with session correlation |
| Knowledge reuse | None | Cross-project via git submodule |
| Philosophy | Maximize automation | Balance AI capability with human control |

### Unique Selling Points (USPs)

1. **Taste-Aware Memory** — Not just "remember this" but structured capture of decisions, principles, and preferences with scoring and governance. The AI learns your "taste" (品味) — your judgment, preferences, and responsibility.

2. **Silent Success Philosophy** — Follows Unix CLI philosophy. No verbose confirmations, no process narration. Saves tokens and attention.

3. **AI Native Design** — Neither "give everything to AI" nor "replace AI with rules." Uses AI for semantic tasks, deterministic scripts for mechanical tasks.

4. **Composable, Not Prescriptive** — Every workflow step is optional. No forced linear flow. Experienced devs can enter at any stage.

5. **Cross-Project Knowledge Transfer** — Share team-level conventions across projects via git submodules. Memories have audience/portability metadata for controlled sharing.

6. **Self-Documenting Architecture** — The `about-lingxi` skill means the AI itself can explain and evaluate LingXi's own architecture and design decisions.

7. **Writing Style Continuity** — The style-fusion feature learns your writing voice and applies it consistently across documentation.

---

## 7. Project Metadata

| Field | Value |
|-------|-------|
| **Repository** | [github.com/tower1229/LingXi](https://github.com/tower1229/LingXi) |
| **Author** | tower1229 |
| **Language** | JavaScript (Node.js scripts), Markdown (skills, commands, docs) |
| **Plugin Version** | 1.1.0 |
| **License** | Not explicitly stated (but MIT mentioned in plugin.json) |
| **Created** | 2026-01-11 |
| **Last Updated** | 2026-02-25 |
| **Stars** | 0 (new project) |
| **Issues** | None open |
| **Releases** | None yet |
| **Primary Language** | Chinese (with English translations for README and commands) |

---

## 8. Key Terminology (Glossary)

| Term | Chinese | Meaning |
|------|---------|---------|
| Taste (品味) | 品味 | The user's judgment, preferences, principles — what LingXi captures and remembers |
| Memory Note | 记忆 | A structured Markdown file storing a captured preference/decision |
| INDEX | 索引 | The single source of truth listing all memory notes |
| SSoT | 单一事实来源 | Single Source of Truth — each piece of info defined in one place |
| Silent Success | 静默成功 | No output when things work fine (Unix philosophy) |
| Taste Recognition | 品味识别 | The skill that identifies capturable preferences from user input |
| Memory Retrieve | 记忆提取 | The skill that searches and injects relevant memories each turn |
| Human Gate | 人工门控 | Required user confirmation for critical decisions |
| Style Fusion | 风格融合 | Feature that learns and replicates writing style |
| Workspace Bootstrap | 工作区引导 | Initial setup of the `.cursor/.lingxi/` directory structure |

---

## 9. Content Map for Marketing Website

Based on this research, here's a suggested content strategy:

### Homepage Hero
- **Headline:** "Your AI remembers." / "让 AI 记住你的方式"
- **Subhead:** "Persistent memory and structured workflows for Cursor"
- **CTA:** Quick Start guide (script install)

### Key Pages to Create
1. **What is LingXi** — Problem/solution, value proposition
2. **Features** — The 6 core features with visuals
3. **How It Works** — Architecture diagram, memory system explanation
4. **Quick Start** — Installation + first 5 minutes walkthrough
5. **Commands Reference** — All commands with examples
6. **Memory System** — Deep dive into how memory works
7. **Team Sharing** — Cross-project knowledge sharing guide
8. **FAQ** — Common questions, comparisons
9. **Changelog** — Version history

### Marketing Angles
- **For individuals:** "Your AI assistant that actually learns"
- **For teams:** "Encode your team's standards once, apply everywhere"
- **For productivity:** "Stop repeating yourself to AI"
- **Technical depth:** "AI-native architecture that respects both AI capability and human judgment"

---

## 10. Observations & Notes

1. **Very new project** — Created Jan 2026, 0 stars, no issues, sole contributor. Early stage but architecturally mature.

2. **Deep documentation** — The project is exceptionally well-documented internally, with extensive design principles, evaluation criteria, and engineering practices. This suggests strong product thinking.

3. **Chinese-first** — Primary documentation and internal docs are in Chinese. English README exists but some internal docs are Chinese-only.

4. **Cursor-dependent** — Entirely built on Cursor's plugin infrastructure (Commands, Skills, Hooks, Subagents). Cannot work with other editors/IDEs.

5. **No runtime dependencies** — Uses only Node.js built-in modules. No npm packages required for the plugin itself.

6. **Plugin distribution** — Has a `plugin.json` manifest for future Cursor plugin marketplace; currently install via script only. No releases yet published on GitHub.

7. **The "taste" concept** — The structured 7-field taste payload is a novel approach to capturing user preferences. It goes beyond simple "remember this" to structured decision capture with scoring.

8. **Dogfooding** — The project uses its own workflow system. The `.cursor/.lingxi/tasks/` directory contains actual task documents (audit system, memory improvements, etc.) created using the LingXi workflow.

9. **Install script quality** — The bash install script is production-quality with retry logic, error handling, JSON parsing fallbacks (jq → Python), and Windows compatibility considerations.
