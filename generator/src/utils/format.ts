/**
 * Frontmatter generation utilities
 */

import type { AgentConfig, SkillConfig, CommandConfig, PlatformConfig } from '../../../src/config/types'

/**
 * Generate YAML frontmatter for an agent
 */
export function generateAgentFrontmatter(agent: AgentConfig, platform: PlatformConfig): string {
  const lines: string[] = ['---']
  
  lines.push(`name: ${agent.name}`)
  lines.push(`description: ${agent.description}`)
  
  if (platform.features.supportsTools) {
    lines.push(`tools: ${agent.tools.join(', ')}`)
  }
  
  if (platform.features.supportsColors) {
    lines.push(`color: ${agent.color}`)
  }
  
  lines.push('---')
  return lines.join('\n')
}

/**
 * Generate YAML frontmatter for a skill
 */
export function generateSkillFrontmatter(skill: SkillConfig, platform: PlatformConfig): string {
  const lines: string[] = ['---']
  
  lines.push(`name: ${skill.name}`)
  lines.push(`description: ${skill.description}`)
  
  lines.push('---')
  return lines.join('\n')
}

/**
 * Generate YAML frontmatter for a command
 */
export function generateCommandFrontmatter(command: CommandConfig, platform: PlatformConfig): string {
  const lines: string[] = ['---']
  
  lines.push(`name: ${command.name}`)
  lines.push(`description: ${command.description}`)
  
  lines.push('---')
  return lines.join('\n')
}
