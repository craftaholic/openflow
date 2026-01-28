# Content Layer

Domain entities (agents, skills, commands) defined as TypeScript data objects.

## Structure

```
content/
├── agents/      # 4 agents (researcher, architect, executor, verifier)
├── skills/      # 8 skills (typescript, golang, python, bash, etc.)
└── commands/    # 1 command (o - orchestrate)
```

## Where to Look

| Entity | Location | Export |
|--------|----------|--------|
| Agents | `agents/*.ts` | `export const {name}: Agent` |
| Skills | `skills/*.ts` | `export const {name}: Skill` |
| Commands | `commands/*.ts` | `export const {name}: Command` |

## Patterns

**Agent definition:**
```typescript
import type { Agent } from '../../interfaces/agent'

export const researcher: Agent = {
  name: "researcher",
  description: "Explore codebase, find patterns...",
  instruction: `# Researcher\n\n...markdown...`
}
```

**Skill definition:**
```typescript
import type { Skill } from '../../interfaces/skill'

export const typescript: Skill = {
  name: "typescript",
  description: "TypeScript patterns...",
  instruction: `# TypeScript\n\n...markdown...`
}
```

**Command definition:**
```typescript
import type { Command } from '../../interfaces/command'

export const orchestrate: Command = {
  name: "o",
  description: "Enter orchestrate mode",
  instruction: `# /o Command\n\n...`,
  trigger: "/o"
}
```

## Conventions

- Use `import type` for interfaces
- `name` in kebab-case
- `instruction` contains markdown content
- Template literals for multi-line markdown

## Related

- Interfaces: `../interfaces/`
- Platform mappers: `../platforms/`
