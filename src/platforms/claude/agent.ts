import { researcher } from '../../content/agents/researcher'
import { architect } from '../../content/agents/architect'
import { executor } from '../../content/agents/executor'
import { verifier } from '../../content/agents/verifier'

export const claudeAgents = {
  researcher: { name: researcher.name, description: researcher.description, instruction: researcher.instruction },
  architect: { name: architect.name, description: architect.description, instruction: architect.instruction },
  executor: { name: executor.name, description: executor.description, instruction: executor.instruction },
  verifier: { name: verifier.name, description: verifier.description, instruction: verifier.instruction },
}
