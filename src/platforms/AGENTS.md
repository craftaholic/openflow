# Platform Layer

Platform adapters that map content to platform-specific configurations.

## Structure

```
platforms/
├── opencode/    # OpenCode platform mappers
└── claude/      # Claude Code platform mappers
```

## Where to Look

| Platform | Location | Exports |
|----------|----------|---------|
| OpenCode | `opencode/*.ts` | `opencodeAgents`, `opencodeSkills`, `opencodeCommands` |
| Claude | `claude/*.ts` | `claudeAgents`, `claudeSkills`, `claudeCommands` |

## Patterns

**Platform mapper:**
```typescript
import { researcher } from '../../content/agents/researcher'
import { architect } from '../../content/agents/architect'

export const opencodeAgents = {
  researcher: { name: researcher.name, description: researcher.description, instruction: researcher.instruction },
  architect: { name: architect.name, description: architect.description, instruction: architect.instruction }
}
```

## Conventions

- Import from `../../content/` directories
- Export platform-prefixed objects (`opencodeAgents`, `claudeAgents`)
- Map fields from content to platform-specific format
- Keep transformation simple (field copy)

## Related

- Content source: `../content/`
