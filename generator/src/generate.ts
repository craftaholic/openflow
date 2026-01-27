/**
 * Main generation logic for creating platform-specific output
 */

import { join, resolve } from 'node:path'
import { agents } from '../../src/config/agents'
import { skills } from '../../src/config/skills'
import { commands } from '../../src/config/commands'
import { globalConfig } from '../../src/config/global'
import type { PlatformConfig } from '../../src/config/types'
import { readMarkdown, writeFile } from './utils/files'
import { generateAgentFrontmatter, generateSkillFrontmatter, generateCommandFrontmatter } from './utils/format'

const SRC_ROOT = resolve(__dirname, '../../src')
const DIST_ROOT = resolve(__dirname, '../../dist')

/**
 * Generate files for a specific platform
 */
export async function generateForPlatform(platformConfig: PlatformConfig): Promise<void> {
  const { platform, folderStructure } = platformConfig
  const platformRoot = join(DIST_ROOT, platform)
  
  console.log(`\nGenerating for ${platformConfig.displayName}...`)
  
  // Generate agents
  for (const agent of agents) {
    const contentPath = join(SRC_ROOT, agent.contentFile)
    const content = await readMarkdown(contentPath)
    const frontmatter = generateAgentFrontmatter(agent, platformConfig)
    const output = `${frontmatter}\n\n${content}`
    
    const outputPath = join(platformRoot, folderStructure.agentPath, `${agent.name}.md`)
    await writeFile(outputPath, output)
    console.log(`  ✓ Agent: ${agent.name}`)
  }
  
  // Generate skills
  for (const skill of skills) {
    const contentPath = join(SRC_ROOT, skill.contentFile)
    const content = await readMarkdown(contentPath)
    const frontmatter = generateSkillFrontmatter(skill, platformConfig)
    const output = `${frontmatter}\n\n${content}`
    
    const outputPath = join(platformRoot, folderStructure.skillPath, skill.name, 'SKILL.md')
    await writeFile(outputPath, output)
    console.log(`  ✓ Skill: ${skill.name}`)
  }
  
  // Generate commands
  for (const command of commands) {
    const contentPath = join(SRC_ROOT, command.contentFile)
    const content = await readMarkdown(contentPath)
    const frontmatter = generateCommandFrontmatter(command, platformConfig)
    const output = `${frontmatter}\n\n${content}`
    
    const outputPath = join(platformRoot, folderStructure.commandPath, `${command.name}.md`)
    await writeFile(outputPath, output)
    console.log(`  ✓ Command: ${command.name}`)
  }
  
  // Generate global config
  const globalContentPath = join(SRC_ROOT, globalConfig.contentFile)
  const globalContent = await readMarkdown(globalContentPath)
  const globalOutputPath = join(platformRoot, folderStructure.globalFile)
  await writeFile(globalOutputPath, globalContent)
  console.log(`  ✓ Global: ${folderStructure.globalFile}`)
  
  console.log(`✓ ${platformConfig.displayName} generation complete\n`)
}

/**
 * Generate files for all platforms
 */
export async function generateAll(): Promise<void> {
  const opencodeConfig = await import('../../src/platforms/opencode.json')
  const claudeConfig = await import('../../src/platforms/claude-code.json')
  
  await generateForPlatform(opencodeConfig.default as PlatformConfig)
  await generateForPlatform(claudeConfig.default as PlatformConfig)
}
