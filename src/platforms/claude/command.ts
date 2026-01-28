import { orchestrate } from '../../content/commands/o'

export const claudeCommands = {
  o: { name: orchestrate.name, description: orchestrate.description, trigger: orchestrate.trigger, instruction: orchestrate.instruction },
}
