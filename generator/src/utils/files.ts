/**
 * File operations utilities
 */

import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

/**
 * Read markdown file and return content
 */
export async function readMarkdown(filePath: string): Promise<string> {
  const file = Bun.file(filePath)
  return await file.text()
}

/**
 * Write content to file
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  await ensureDir(dirname(filePath))
  await Bun.write(filePath, content)
}

/**
 * Ensure directory exists, create if not
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true })
}
