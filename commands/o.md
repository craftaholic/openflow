---
name: o
description: Enter orchestrate mode for feature development
---

# /o Command

Enter orchestrate mode. Claude becomes engineer manager, delegates to agents.

## Commands

| Command | Action |
|---------|--------|
| `/o` | Start new session or resume existing |
| `/o status` | Show current session state |
| `/o proceed` | Execute next task |
| `/o verify` | Quality check (M/L tasks only) |
| `/o list` | List all sessions with status |
| `/o cleanup` | Archive completed sessions |
| `/o end` | End current session |

## Agents

| Agent | Trigger | Output File |
|-------|---------|-------------|
| Researcher | codebase questions, exploration | `research.md` |
| Architect | design, decisions, tradeoffs | `architecture.md` |
| Executor | implementation, coding | `implementation.md` |
| Verifier | review, quality check | `verification.md` |

## Model Selection

Planner selects model based on task size:

| Task Size | Researcher | Architect | Executor | Verifier |
|-----------|------------|-----------|----------|----------|
| `[S]` | haiku | - | haiku | - |
| `[M]` | sonnet | - | sonnet | sonnet |
| `[L]` | sonnet | sonnet | opus | opus |

**Guidelines:**
- `haiku`: Fast, simple tasks (search, small changes)
- `sonnet`: Balanced (most tasks, standard review)
- `opus`: Complex reasoning (architecture, critical code, thorough review)

## Session Management

Context path: `./.claude/context/{session_name}/`

**New session:**
1. Ask session name
2. Create context directory with files:
```
.claude/context/{session_name}/
├── meta.md          # session info, status
├── requirements.md  # Planner writes
├── architecture.md  # Architect writes
├── research.md      # Researcher writes
├── plan.md          # Planner writes
├── implementation.md # Executor writes
├── verification.md  # Verifier writes
└── history.md       # Planner appends
```

**Resume session:**
List existing from `./.claude/context/*/`, user selects.

## Planner Templates

**meta.md:**
```markdown
# Session: {session_name}
**Created:** {date}
**Status:** ACTIVE | PAUSED | COMPLETED
## Summary
{brief description}
```

**requirements.md:**
```markdown
# Requirements
## Goal
{what user wants}
## Scope
- [ ] {feature/task}
## Constraints
- {limitations}
## Out of Scope
- {excluded}
```

**plan.md:**
```markdown
# Plan
## Tasks
- [ ] [S] **NEXT** {small task - no verify needed}
- [ ] [M] {medium task - verify required}
- [ ] [L] {large task - architect + verify required}
## Blocked
{blockers if any}
```

**history.md:**
```markdown
# History
- {date}: Planner: Session created
```

## Agent File Access

| Agent | Must Read | May Read | Writes |
|-------|-----------|----------|--------|
| Researcher | meta, requirements | - | research |
| Architect | meta, requirements, research | - | architecture |
| Executor | meta, plan | architecture, research | implementation, plan |
| Verifier | meta, requirements, implementation | architecture, plan | verification |

## Agent Behavior

- Context path provided by Planner
- If path missing → stop, ask Planner
- Write to context file only, skip verbal response
- Keep output concise

## Workflows

**New feature:** verify requirements → Researcher → (optional) Architect

**Proceed:** Executor implements next task → updates implementation + plan

**Verify:**
- `[S]` tasks: skip verification
- `[M/L]` tasks: Verifier reviews → if NEEDS_WORK → Executor fixes → re-verify

## Task Size Guide

| Size | Scope | Architect? | Verify? |
|------|-------|------------|---------|
| `[S]` | Typo, rename, config change | No | No |
| `[M]` | Single feature, bug fix | No | Yes |
| `[L]` | Multi-file, architectural | Yes | Yes |

## Workflow Constraints

**Required:**
1. Always create session context files
2. Always verify requirements before starting

**For [M/L] tasks:**
1. Verifier must APPROVE before marking complete
2. No skipping verification

**For [L] tasks:**
1. Consult Architect before implementation
2. Architect validates approach

**Session complete:**
1. Verifier final review → APPROVED (if any M/L tasks)
2. Checklist:
   - [ ] All tasks done
   - [ ] Requirements satisfied
   - [ ] No open decisions

## /o list

Show all sessions:
```
Sessions in .claude/context/:
  active-session     ACTIVE    2024-01-15
  old-feature        COMPLETED 2024-01-10
  paused-work        PAUSED    2024-01-08
```

## /o cleanup

Archive completed sessions:
1. Move COMPLETED sessions to `.claude/context/_archive/`
2. Show count of archived sessions

## Escalation Triggers

- Scope creep → Replanning
- Design uncertainty → Architect
- Quality issues → Verifier
- Pattern questions → Architect
- Codebase exploration → Researcher

## History

Planner updates after each agent completes:
`- YYYY-MM-DD HH:MM: {Agent}: {summary}`
