# Source Directory

This directory contains the **source files** for the project. Platform-specific files are generated from here into `dist/`.

## Structure

```
src/
├── config/              # TypeScript configuration
│   ├── platforms/       # Platform-specific configs
│   │   ├── opencode.ts
│   │   ├── claude-code.ts
│   │   └── index.ts
│   └── types.ts         # Type definitions
└── content/             # Markdown content
    ├── agents/          # Agent definitions
    ├── skills/          # Skill definitions
    │   ├── bash/
    │   ├── golang/
    │   ├── python/
    │   └── ...
    └── commands/        # Command definitions
```

## Config vs Content

### `config/` - TypeScript Configuration

Platform-specific build configurations:
- **File format**: TypeScript (`.ts`)
- **Purpose**: Define how content is transformed for each platform
- **Examples**: File extensions, templates, output paths

### `content/` - Markdown Content

Agents, skills, and commands:
- **File format**: Markdown (`.md`)
- **Purpose**: Define behavior, knowledge, and commands
- **Examples**: Agent roles, skill patterns, command syntax

## Editing Content

1. Edit markdown files in `src/content/`
2. Run `npm run build` to regenerate `dist/`
3. Run `make install` to test changes

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

## Platform Support

Each platform config in `src/config/platforms/` defines:
- Output directory structure
- File extensions
- Content transformation templates

Currently supported:
- **OpenCode**: `src/config/platforms/opencode.ts`
- **Claude Code**: `src/config/platforms/claude-code.ts`

To add a new platform, see [CONTRIBUTING.md](../CONTRIBUTING.md#adding-platform-support).
