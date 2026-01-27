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

### Quick Install (Recommended)

```bash
curl -L https://openflow.dev/install | bash
```

This single command will:
- Detect your installed AI editors (OpenCode, Claude Code)
- Generate platform-specific files
- Install all skills and configurations

### Manual Installation

If you prefer to run steps manually or contribute to the project:

```bash
git clone https://github.com/craftaholic/claude-orchestrator.git
cd claude-orchestrator
npm install    # Install dependencies
npm run build  # Generate platform-specific files
./install.sh   # Install to detected platforms
```

### Available Commands

| Command | Action |
|---------|--------|
| `./install.sh` | Auto-detect and install |
| `./install.sh --platform opencode` | Install to OpenCode only |
| `./install.sh --platform claude-code` | Install to Claude Code only |
| `./install.sh --dry-run` | Preview installation |
| `make generate` | Generate configuration files only |
| `make backup` | Backup `~/.claude` |
| `make uninstall` | Remove repo files, keep user files |

### Advanced Options

**install-fresh** - Backup existing configuration and perform a clean install:

```bash
./install.sh
```

The installer automatically backs up existing configurations before installing.

**Note:** `npm run build` generates platform-specific files. Run it after pulling updates if installing manually.

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
