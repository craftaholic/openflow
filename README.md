# Claude Orchestrator

Claude Code configuration with agents, skills, and commands for software/platform engineering.

## Structure

```
├── agents/           # Agent definitions (researcher, architect, executor, verifier)
├── commands/         # Custom slash commands
├── skills/           # Skill modules (cloud, kubernetes, architecture)
└── CLAUDE.md         # Global instructions & orchestrate mode config
```

## Installation

```bash
git clone https://github.com/craftaholic/claude-orchestrator.git
cd claude-orchestrator
make install
```

| Command | Action |
|---------|--------|
| `make install` | Overwrite repo files, keep user files (recommended) |
| `make install-fresh` | Backup existing + clean install |
| `make install-merge` | Add missing files only, never overwrite |
| `make uninstall` | Remove repo files only, keep user files |
| `make backup` | Backup `~/.claude` |

## Features

- **Orchestrate Mode**: Engineer manager workflow with specialized agents
- **Agents**: Researcher, Architect, Executor, Verifier
- **Skills**: Cloud architecture, Kubernetes, clean architecture patterns
- **Commands**: Custom slash commands (e.g., `/o` for orchestrate mode)
