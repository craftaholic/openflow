# Claude Orchestrator

Claude Code configuration with agents, skills, and commands for software/platform engineering.

## Structure

```
├── agents/           # Agent definitions (researcher, architect, executor, verifier)
├── commands/         # Custom slash commands
├── skills/           # Skill modules (cloud, kubernetes, architecture)
└── CLAUDE.md         # Global instructions & orchestrate mode config
```

## Integration with Dotfiles

This repo is a git submodule of [dotfiles](https://github.com/craftaholic/dotfiles) at `claude/.claude/`.

### Fresh machine setup

```bash
git clone --recurse-submodules git@github.com:craftaholic/dotfiles.git ~/dotfiles
cd ~/dotfiles
make setup  # or: task setup
```

This initializes submodules and runs `stow claude --no-folding` to symlink to `~/.claude/`.

### Standalone usage

```bash
git clone git@github.com:craftaholic/claude-orchestrator.git ~/.claude
```

## Development

Work directly in this repo. Changes reflect in `~/.claude/` via symlinks.

To update the submodule reference in dotfiles:

```bash
cd ~/dotfiles/claude/.claude
git pull origin main
cd ~/dotfiles
git add claude/.claude
git commit -m "chore: update claude submodule"
git push
```

## Features

- **Orchestrate Mode**: Engineer manager workflow with specialized agents
- **Agents**: Researcher, Architect, Executor, Verifier
- **Skills**: Cloud architecture, Kubernetes, clean architecture patterns
- **Commands**: Custom slash commands (e.g., `/o` for orchestrate mode)
