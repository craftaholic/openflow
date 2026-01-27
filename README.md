# Claude Orchestrator

Claude Code configuration with agents, skills, and orchestrate mode for software/platform engineering.

## Architecture

This project uses a **source-to-distribution** architecture:

```
src/                    # Source files (TypeScript configs + markdown)
├── config/            # Platform-specific TypeScript configs
└── content/           # Agents, skills, commands (markdown)

generator/             # Build system
└── generate.ts        # Compiles src/ → dist/

dist/                  # Generated output (git-ignored)
├── opencode/          # OpenCode platform files
└── claude-code/       # Claude Code platform files
```

**Installation generates platform-specific files** from shared source. See [generator/README.md](generator/README.md) for details.

## Structure

```
├── agents/             # Specialized agents
│   ├── researcher.md   # Codebase exploration
│   ├── architect.md    # System design
│   ├── executor.md     # Implementation
│   └── verifier.md     # Code review
├── commands/
│   └── o.md            # /o orchestrate mode
├── skills/             # Domain knowledge
│   ├── bash/
│   ├── clean-architecture/
│   ├── cloud/
│   ├── golang/
│   ├── kubernetes/
│   ├── python/
│   ├── terraform/
│   └── typescript/
└── CLAUDE.md           # Global instructions
```

## Installation

```bash
git clone https://github.com/craftaholic/claude-orchestrator.git
cd claude-orchestrator
npm install    # Install dependencies
npm run build  # Generate platform-specific files
make install   # Install to ~/.claude or ~/.opencode
```

| Command | Action |
|---------|--------|
| `make install` | Overwrite repo files, keep user files |
| `make install-fresh` | Backup existing + clean install |
| `make install-merge` | Add missing files only |
| `make uninstall` | Remove repo files, keep user files |
| `make backup` | Backup `~/.claude` |

**Note:** `npm run build` generates platform-specific files. Run it after pulling updates.

## Orchestrate Mode

Use `/o` to enter orchestrate mode. Claude becomes an engineering manager, delegating to specialized agents.

### Commands

| Command | Action |
|---------|--------|
| `/o` | Start or resume session |
| `/o status` | Show session state |
| `/o proceed` | Execute next task |
| `/o verify` | Quality check |
| `/o list` | List all sessions |
| `/o cleanup` | Archive completed |
| `/o end` | End session |

### Workflow

1. Start session → define requirements
2. Researcher explores codebase
3. Architect designs (for large tasks)
4. Executor implements tasks
5. Verifier reviews (for M/L tasks)

### Task Sizes

| Size | Example | Architect | Verify |
|------|---------|-----------|--------|
| `[S]` | Typo, config | No | No |
| `[M]` | Feature, bug fix | No | Yes |
| `[L]` | Multi-file, architectural | Yes | Yes |

### Model Selection

Models chosen by task complexity:

| Task | Researcher | Architect | Executor | Verifier |
|------|------------|-----------|----------|----------|
| `[S]` | haiku | - | haiku | - |
| `[M]` | sonnet | - | sonnet | sonnet |
| `[L]` | sonnet | sonnet | opus | opus |

## Skills

| Skill | Description |
|-------|-------------|
| `bash` | Defensive shell scripting |
| `clean-architecture` | Layer patterns, DI |
| `cloud` | AWS/Azure/GCP patterns |
| `golang` | Go backend patterns |
| `kubernetes` | K8s architecture |
| `python` | Python backend patterns |
| `terraform` | IaC for AWS |
| `typescript` | TS/Node.js patterns |

## For Contributors

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add agents, skills, commands, or platform support.
