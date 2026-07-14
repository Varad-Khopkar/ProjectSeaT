import React from 'react'
import type { BriefingBlock } from '../types'

export interface BlockRenderProps {
  block: BriefingBlock
  onComplete?: (completed: boolean) => void
  answers?: Record<string, number>
  onAnswerSelected?: (questionId: string, optionIndex: number) => void
}

export type BlockRenderer = React.ComponentType<BlockRenderProps>

class BlockRegistry {
  private registry = new Map<string, BlockRenderer>()

  /**
   * Registers a component renderer for a specific briefing block type.
   */
  register(type: string, renderer: BlockRenderer): void {
    this.registry.set(type, renderer)
  }

  /**
   * Retrieves the renderer component registered for a briefing block type.
   */
  get(type: string): BlockRenderer | undefined {
    return this.registry.get(type)
  }

  /**
   * Checks if a renderer plugin exists for the specified type.
   */
  has(type: string): boolean {
    return this.registry.has(type)
  }

  /**
   * Lists all registered block types.
   */
  registeredTypes(): string[] {
    return Array.from(this.registry.keys())
  }
}

export const blockRegistry = new BlockRegistry()
