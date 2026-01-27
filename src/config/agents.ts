import type { AgentConfig } from './types'

export const agents: AgentConfig[] = [
  {
    name: "researcher",
    description: "Explore codebase, find patterns, map dependencies, identify constraints",
    tools: ["Read", "Write", "Edit", "Grep", "Glob"],
    color: "blue",
    contentFile: "content/agents/researcher.md"
  },
  {
    name: "architect",
    description: "Design system structure, make technical decisions, define component boundaries",
    tools: ["Read", "Write", "Edit", "Grep", "Glob"],
    color: "purple",
    contentFile: "content/agents/architect.md"
  },
  {
    name: "executor",
    description: "Implement planned tasks, write code, follow patterns, track progress",
    tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"],
    color: "green",
    contentFile: "content/agents/executor.md"
  },
  {
    name: "verifier",
    description: "Review code quality, check against requirements, identify issues and improvements",
    tools: ["Read", "Write", "Edit", "Grep", "Glob"],
    color: "red",
    contentFile: "content/agents/verifier.md"
  }
]
