/**
 * The Warn type
 * Note that this isn't its own collection as there isn't a way to "query" within Keyv
 */
export type Warn = {
  timestamp: number
  reason: string
  by: string
  to: string
  id: number
  final: boolean
}

export type BoostRole = {
  role: string
}

export type Server = {
  logging: {
    /**
     * The default logging channel, otherwise can explicitly set logging channels
     */
    default: string
    ban: string
    unban: string
    warn: string
  }
  // Warning commands
  warns: {
    /**
     * The warn ID count, this is done so that we can delete warns (this is actually bad, we should be querying)
     */
    id: 0 // always increment **before** using
    warns: Warn[]
  }
  // Boost role commands
  boostRoles: {
    "12342345643122453": BoostRole
  }
  // Afk commands
  afk: {
    "12342345643122453": { message: string; timestamp: number }
  }
  bumpInfo: { bumpedAt: Date; nextBump: Date }
}
