# Contributing

This project uses a **source-to-distribution** architecture. All content lives in `src/`, and platform-specific files are generated into `dist/` via the generator.

## Architecture Overview

The project has 4 architectural layers:

```
src/
├── config/          # TypeScript configs (agents.ts, skills.ts, commands.ts, global.ts, types.ts)
├── content/         # Markdown content (agents, skills, commands - flat structure)
└── platforms/       # Platform configs (opencode.ts, claude-code.ts, kiro.ts)

generator/           # Build system (TypeScript)
└── src/

dist/                # Generated output (git-ignored)
├── opencode/
├── claude-code/
└── kiro/
```

### Layer Details

- **`src/config/`** - TypeScript configuration files defining agents, skills, commands, and global settings
- **`src/content/`** - Markdown content files with agents, skills, and commands (flat structure, no nested directories)
- **`src/platforms/`** - Platform-specific TypeScript configs (opencode.ts, claude-code.ts, kiro.ts)
- **`generator/`** - Build system that compiles `src/` into platform-specific `dist/` outputs

## Quick Start

1. Edit files in `src/content/` (agents, skills, commands)
2. Run `npm run build` to regenerate `dist/`
3. Run `./install.sh` to test changes

## Adding New Content

### Add a New Agent

1. Create `src/content/agents/your-agent.md`
2. Add agent metadata to `src/config/agents.ts`:
   ```typescript
   {
     name: "your-agent",
     description: "Brief description of agent purpose",
     tools: ["Read", "Write", "Edit"],
     color: "blue",
     contentFile: "content/agents/your-agent.md"
   }
   ```
3. Run `npm run build` to generate platform files
4. Test with `./install.sh`

### Add a New Skill

1. Create `src/content/skills/your-skill.md` (flat structure, not nested)
2. Add skill metadata to `src/config/skills.ts`:
   ```typescript
   {
     name: "your-skill",
     description: "Brief description of skill purpose",
     contentFile: "content/skills/your-skill.md"
   }
   ```
3. Run `npm run build`
4. Test with `./install.sh`

### Add a New Command

1. Create `src/content/commands/your-command.md`
2. Add command metadata to `src/config/commands.ts`:
   ```typescript
   {
     name: "your-command",
     description: "Brief description of command purpose",
     contentFile: "content/commands/your-command.md"
   }
   ```
3. Run `npm run build`
4. Run `./install.sh` to test changes

### Modify Existing Content

1. Edit the markdown file in `src/content/`
2. Run `npm run build` to regenerate
3. Test with `./install.sh`

## Adding Platform Support

Platforms use **dynamic discovery** - simply add a `.ts` file to `src/platforms/` and it will be automatically detected.

### Step 1: Create Platform Config

Create `src/platforms/your-platform.ts`:

```typescript
import type { PlatformConfig } from '../config/types'

export const yourPlatform: PlatformConfig = {
  platform: 'your-platform',
  displayName: 'Your Platform',
  folderStructure: {
    root: '.your-platform',
    agentPath: 'agents',
    skillPath: 'skills',
    commandPath: 'commands',
    globalFile: 'CONFIG.md'
  },
  frontmatter: {
    agents: { required: ['name', 'description', 'tools', 'color'] },
    skills: { required: ['name', 'description'] },
    commands: { required: ['name', 'description'] }
  },
  features: {
    supportsFrontmatter: true,
    supportsColors: true,
    supportsTools: true
  }
}
```

### Step 2: Run Generator

The platform will be automatically discovered:

```bash
# Generate all platforms (auto-discovers opencode, claude-code, kiro, and your-platform)
npm run build

# Generate specific platform only
npm run build -- --platform your-platform

# Verify output
ls dist/your-platform/
```

### Platform Configuration Reference

| Property | Type | Description |
|----------|------|-------------|
| `platform` | string | Platform identifier (used in CLI) |
| `displayName` | string | Human-readable name |
| `folderStructure.root` | string | Root directory name |
| `folderStructure.agentPath` | string | Agents subdirectory |
| `folderStructure.skillPath` | string | Skills subdirectory |
| `folderStructure.commandPath` | string | Commands subdirectory |
| `folderStructure.globalFile` | string | Global config filename |
| `frontmatter.agents.required` | string[] | Required agent frontmatter fields |
| `frontmatter.skills.required` | string[] | Required skill frontmatter fields |
| `frontmatter.commands.required` | string[] | Required command frontmatter fields |
| `features.supportsFrontmatter` | boolean | Enable YAML frontmatter |
| `features.supportsColors` | boolean | Enable agent color coding |
| `features.supportsTools` | boolean | Enable agent tool restrictions |

## How the Generator Works

The generator (`generator/src/index.ts`) performs these steps:

1. **Discovers platforms** - Uses `fs.readdirSync` to find all `.ts` files in `src/platforms/`
2. **Loads configs** - Dynamically imports platform modules using `import()`
3. **Reads content** - Loads markdown files from `src/content/` (agents, skills, commands)
4. **Reads configs** - Loads TypeScript configs from `src/config/` (agents.ts, skills.ts, commands.ts, global.ts)
5. **Generates output** - Creates platform-specific files in `dist/<platform>/`

The generator is stateless and idempotent—running it multiple times produces the same output.

See [generator/README.md](generator/README.md) for technical details.

## Testing Changes

```bash
# Run tests
bun test generator/src/__tests__/

# Generate files
npm run build

# Install to test
./install.sh

# Verify in Claude Code or OpenCode
# Test agents, skills, commands work as expected
```

### Test Suite

The generator has a comprehensive test suite in `generator/src/__tests__/`:
- Platform discovery tests
- Config loading tests
- Content generation tests
- Frontmatter generation tests

Run tests before submitting changes:
```bash
cd generator && bun test
```

## Code Style

- **Markdown**: Clear, concise, actionable
- **TypeScript**: Typed, modular, documented
- **Commits**: Atomic, descriptive

## Questions?

Open an issue or discussion on GitHub.
