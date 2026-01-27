#!/usr/bin/env bun

/**
 * CLI entry point for the generator tool
 */

import { generateForPlatform, generateAll } from './generate'
import type { PlatformConfig } from '../../src/config/types'

async function main() {
  const args = process.argv.slice(2)
  
  // Parse --platform argument
  const platformIndex = args.indexOf('--platform')
  const platform = platformIndex !== -1 ? args[platformIndex + 1] : 'all'
  
  console.log('OpenFlow Generator')
  console.log('==================\n')
  
  if (platform === 'all') {
    await generateAll()
  } else if (platform === 'opencode') {
    const opencodeConfig = await import('../../src/platforms/opencode.json')
    await generateForPlatform(opencodeConfig.default as PlatformConfig)
  } else if (platform === 'claude-code') {
    const claudeConfig = await import('../../src/platforms/claude-code.json')
    await generateForPlatform(claudeConfig.default as PlatformConfig)
  } else {
    console.error(`Error: Unknown platform "${platform}"`)
    console.error('Usage: bun generate [--platform opencode|claude-code|all]')
    process.exit(1)
  }
  
  console.log('✓ Generation complete!')
}

main().catch((error) => {
  console.error("Error:", error)
  process.exit(1)
})
