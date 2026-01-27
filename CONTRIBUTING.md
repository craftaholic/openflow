# Contributing

This project uses a **source-to-distribution** architecture. All content lives in `src/`, and platform-specific files are generated into `dist/`.

## Quick Start

1. Edit files in `src/content/` (agents, skills, commands)
2. Run `npm run build` to regenerate `dist/`
3. Run `make install` to test changes

## Adding New Content

### Add a New Agent

1. Create `src/content/agents/your-agent.md`
2. Follow existing agent structure (role, constraints, workflow)
3. Run `npm run build` to generate platform files
4. Test with `make install`

### Add a New Skill

1. Create `src/content/skills/your-skill/skill.md`
2. Add skill metadata (name, description, triggers)
3. Add skill content (patterns, examples, guidelines)
4. Run `npm run build`
5. Test with `make install`

### Add a New Command

1. Create `src/content/commands/your-command.md`
2. Define command syntax and behavior
3. Run `npm run build`
4. Test with `make install`

### Modify Existing Content

1. Edit the markdown file in `src/content/`
2. Run `npm run build` to regenerate
3. Test with `make install`

## Adding Platform Support

To support a new platform (e.g., Cursor, Windsurf):

1. Create `src/config/platforms/your-platform.ts`:
   ```typescript
   export const yourPlatformConfig: PlatformConfig = {
     name: 'your-platform',
     outputDir: 'your-platform',
     fileExtensions: { agent: '.md', skill: '.md', command: '.md' },
     agentTemplate: (content) => content,
     skillTemplate: (content) => content,
     commandTemplate: (content) => content,
   };
   ```

2. Register in `src/config/platforms/index.ts`:
   ```typescript
   export { yourPlatformConfig } from './your-platform';
   ```

3. Update `generator/generate.ts` to include your platform
4. Add installation target to `Makefile`
5. Test generation: `npm run build -- --platform your-platform`

## How the Generator Works

The generator (`generator/generate.ts`) reads:
- **Config**: TypeScript files in `src/config/` define platform-specific templates
- **Content**: Markdown files in `src/content/` contain agents, skills, commands

It outputs platform-specific files to `dist/<platform>/`.

See [generator/README.md](generator/README.md) for technical details.

## Testing Changes

```bash
# Generate files
npm run build

# Install to test
make install

# Verify in Claude Code or OpenCode
# Test agents, skills, commands work as expected
```

## Code Style

- **Markdown**: Clear, concise, actionable
- **TypeScript**: Typed, modular, documented
- **Commits**: Atomic, descriptive

## Questions?

Open an issue or discussion on GitHub.
