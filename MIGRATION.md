# Migration Guide: src/ Architecture

## What Changed

OpenFlow now uses a **source-of-truth architecture**:
- **Before:** Files directly in `agents/`, `skills/`, `commands/`, `CLAUDE.md`
- **After:** Source in `src/`, generated to `dist/`, installed from `dist/`

## For Existing Users

### If you have existing installations

Your current `~/.claude/` or `~/.config/opencode/` installations will continue to work.

To upgrade to the new system:

```bash
# Pull latest changes
git pull

# Generate new files
make generate

# Install (will overwrite with generated files)
make install-claude    # For Claude Code
# or
make install-opencode  # For OpenCode
```

### What stays the same

- All agents, skills, and commands work identically
- File formats unchanged (markdown + YAML frontmatter)
- Installation locations unchanged (`~/.claude/` or `~/.config/opencode/`)

### What's new

- **Dual platform support:** Works with both OpenCode and Claude Code
- **Source of truth:** Edit files in `src/`, not root directory
- **Generation step:** Run `make generate` to create platform-specific files
- **Better organization:** Config (TypeScript) separate from content (Markdown)

## For Contributors

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to:
- Add new agents, skills, or commands
- Add support for new platforms
- Modify existing content

## Architecture Overview

```
src/                    # Source of truth (edit here)
├── config/            # TypeScript definitions
├── content/           # Markdown content
└── platforms/         # Platform configs (JSON)

generator/             # Generation tool
└── src/              # TypeScript generator code

dist/                  # Generated output (don't edit)
├── opencode/         # For OpenCode
└── claude-code/      # For Claude Code
```

## Troubleshooting

**Q: I edited a file in `dist/` but changes disappeared**
A: Don't edit `dist/` - it's regenerated. Edit `src/` instead, then run `make generate`.

**Q: How do I add a new skill?**
A: See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-new-skill)

**Q: Can I still use the old files?**
A: Old files in root (`agents/`, `skills/`, etc.) are preserved for reference but not used. The system uses `dist/` now.

**Q: Do I need to run `make generate` every time?**
A: Only when you change files in `src/`. Installation targets (`make install-*`) run generation automatically.
