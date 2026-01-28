# OpenFlow - Claude Orchestrator

**Generated:** 2026-01-28T13:21:00Z

## Overview

Claude Code configuration with specialized agents, domain skills, and orchestrate mode for software/platform engineering. Uses source-to-distribution architecture: TypeScript definitions generate platform-specific markdown configs.

## Structure

```
./
├── src/
│   ├── content/     # Agents, skills, commands (TS with embedded markdown)
│   ├── interfaces/  # Type definitions (Agent, Skill, Command)
│   └── platforms/   # Platform adapters (claude, opencode)
├── dist/            # Generated output (git-ignored)
└── CLAUDE.md        # Global instructions
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Add agent | `src/content/agents/{name}.ts` | Export `Agent` object |
| Add skill | `src/content/skills/{name}.ts` | Export `Skill` object |
| Add command | `src/content/commands/{name}.ts` | Export `Command` object |
| Platform config | `src/platforms/{platform}/` | Mapper files |
| Interface types | `src/interfaces/` | Agent, Skill, Command |

## Code Map

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `Agent` | interface | `interfaces/agent.ts` | Agent type definition |
| `Skill` | interface | `interfaces/skill.ts` | Skill type definition |
| `Command` | interface | `interfaces/command.ts` | Command type definition |
| `researcher` | const | `content/agents/researcher.ts` | Researcher agent |
| `architect` | const | `content/agents/architect.ts` | Architect agent |
| `executor` | const | `content/agents/executor.ts` | Executor agent |
| `verifier` | const | `content/agents/verifier.ts` | Verifier agent |

## Conventions

- Content uses TypeScript data objects (not classes)
- Export const objects implementing interface
- `instruction` field contains markdown string
- Platform mappers import from content and export mapped objects
- `name` in kebab-case, exports in camelCase

## Anti-Patterns (This Project)

- **No**: Modify `dist/` directly (generated, git-ignored)
- **No**: Add `.md` files (content is `.ts` with embedded markdown)
- **No**: Use npm scripts (use `make generate`, `make install`)
- **No**: Skip TypeScript types for new content entities

## Unique Styles

- **Content-as-Code**: Markdown instructions embedded in TS `instruction` field
- **Source-to-Distribution**: Single source → multiple platform outputs
- **Make-based**: Build via `make generate`, deploy via `make install`

## Commands

```bash
make generate    # Generate dist/ from src/
make install     # Install to Claude Code (~/.claude/)
make install-fresh   # Backup + clean install
make backup      # Backup ~/.claude/
make uninstall   # Remove repo files, keep user files
```

## Notes

- Generator (`generator/`) referenced in Makefile but may not exist yet
- README documents old `.md` structure but actual is `.ts` files
- dist/ directories are empty placeholders until `make generate` runs
