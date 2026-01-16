export const COMMANDS = [
  {
    id: 'sync',
    label: 'Run sync',
    dangerous: false,
  },
  {
    id: 'health_check',
    label: 'Health check',
    dangerous: false,
  },
  {
    id: 'clear_cache',
    label: 'Clear cache',
    dangerous: false,
  },
  {
    id: 'reset_system',
    label: 'Reset system',
    dangerous: true,
  },
] as const

export type Command = (typeof COMMANDS)[number]
export type CommandId = Command['id']