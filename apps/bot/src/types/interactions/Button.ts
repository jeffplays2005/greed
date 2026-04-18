import type { CacheType, ButtonInteraction as DiscordButtonInteraction } from "discord.js"
import type { BaseInteractionProp } from "./BaseInteraction"

/**
 * The structure of an interaction handler
 */
export interface ButtonModule {
  config: ButtonConfig
  /**
   * The callback function to run when the interaction is executed
   */
  run<T extends CacheType = CacheType>(props: ButtonInteractionProps<T>): Promise<unknown> | unknown
}

export type ButtonConfig = {
  /**
   * The name of the command
   */
  name: string
  /**
   * If the response given should be ephemeral
   */
  ephemeral?: boolean
  /**
   * If the response should be updated instead of sent as a new message
   */
  update?: boolean
}

/**
 * Button interface that extends the base interaction interace.
 */
export interface ButtonInteractionProps<T extends CacheType = CacheType>
  extends BaseInteractionProp {
  /**
   * The interaction that was executed
   */
  interaction: DiscordButtonInteraction<T>
  /**
   * The interaction name
   * @example s_cfn
   */
  interactionName: string
  /**
   * Any command arguments, normally the initial metadata from the button id
   */
  args: string[]
  /**
   * The original button ID
   * @example "s_cfn-543185949803151370"
   */
  buttonId: `${string}-${string}`
}
