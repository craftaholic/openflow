import type { PlatformConfig } from '../config/types'

export const kiro: PlatformConfig = {
  platform: 'kiro',
  displayName: 'Kiro',
  folderStructure: {
    root: '.kiro',
    agentPath: 'agents',
    skillPath: 'skills',
    commandPath: 'commands',
    globalFile: 'CONFIG.md'
  },
  frontmatter: {
    agents: {
      required: ['name', 'description', 'tools', 'color']
    },
    skills: {
      required: ['name', 'description']
    },
    commands: {
      required: ['name', 'description']
    }
  },
  features: {
    supportsFrontmatter: true,
    supportsColors: true,
    supportsTools: true
  }
}
