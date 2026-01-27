/**
 * TypeScript interfaces for openflow configuration system
 * 
 * This file defines the structure for agents, skills, commands, and platform configurations
 * used in the source-of-truth architecture.
 */

/**
 * Agent configuration
 * Defines a specialized agent role with specific tools and behavior
 */
export interface AgentConfig {
  /** Unique identifier for the agent */
  name: string
  
  /** Human-readable description of the agent's purpose */
  description: string
  
  /** List of tools the agent can use (e.g., "Read", "Write", "Edit", "Grep", "Glob") */
  tools: string[]
  
  /** Color identifier for UI representation */
  color: string
  
  /** Relative path to markdown content file from src/ directory */
  contentFile: string
}

/**
 * Skill configuration
 * Defines domain-specific knowledge and patterns
 */
export interface SkillConfig {
  /** Unique identifier for the skill */
  name: string
  
  /** Human-readable description of when to use this skill */
  description: string
  
  /** Relative path to markdown content file from src/ directory */
  contentFile: string
}

/**
 * Command configuration
 * Defines custom commands available in the platform
 */
export interface CommandConfig {
  /** Command name (e.g., "o" for /o command) */
  name: string
  
  /** Human-readable description of the command's purpose */
  description: string
  
  /** Relative path to markdown content file from src/ directory */
  contentFile: string
}

/**
 * Global configuration
 * Defines global instructions and settings
 */
export interface GlobalConfig {
  /** Relative path to markdown content file from src/ directory */
  contentFile: string
}

/**
 * Folder structure configuration for a platform
 * Defines where files should be installed
 */
export interface FolderStructure {
  /** Root directory (e.g., ".opencode" or ".claude") */
  root: string
  
  /** Path for agent files relative to root */
  agentPath: string
  
  /** Path for skill files relative to root */
  skillPath: string
  
  /** Path for command files relative to root */
  commandPath: string
  
  /** Filename for global configuration */
  globalFile: string
}

/**
 * Frontmatter requirements for a platform
 * Defines which YAML frontmatter fields are required
 */
export interface FrontmatterRequirements {
  /** Required fields for agent files */
  agents: {
    required: string[]
  }
  
  /** Required fields for skill files */
  skills: {
    required: string[]
  }
  
  /** Required fields for command files */
  commands: {
    required: string[]
  }
}

/**
 * Platform feature flags
 * Indicates which features the platform supports
 */
export interface PlatformFeatures {
  /** Whether platform supports YAML frontmatter */
  supportsFrontmatter: boolean
  
  /** Whether platform supports color coding for agents */
  supportsColors: boolean
  
  /** Whether platform supports tool restrictions for agents */
  supportsTools: boolean
}

/**
 * Platform configuration
 * Complete configuration for generating files for a specific platform
 */
export interface PlatformConfig {
  /** Platform identifier (e.g., "opencode", "claude-code") */
  platform: string
  
  /** Human-readable platform name */
  displayName: string
  
  /** Folder structure configuration */
  folderStructure: FolderStructure
  
  /** Frontmatter requirements */
  frontmatter: FrontmatterRequirements
  
  /** Feature flags */
  features: PlatformFeatures
}
