export const ACTIONS = {
  LOGIN: 'login',
  SYNC: 'sync',
  IMPORT: 'import',
  EXPORT: 'export',
} as const

export type CommandType =
  | 'sync'
  | 'health_ok'
  | 'clear_cache'
  | 'reset_system'
  | 'login'
  | 'ACTION_A'
  | 'ACTION_B'
