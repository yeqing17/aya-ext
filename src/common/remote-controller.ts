export type RemoteKeyGroup =
  | 'system'
  | 'dpad'
  | 'navigation'
  | 'media'
  | 'extra'
  | 'tv'
  | 'number'

export interface RemoteKeyDefinition {
  id: string
  keyCode: number
  label: string
  group: RemoteKeyGroup
  icon?: string
  text?: string
  repeatable?: boolean
}

export const REMOTE_KEYS = [
  {
    id: 'power',
    keyCode: 26,
    label: 'power',
    group: 'system',
    icon: 'power',
  },
  {
    id: 'volumeDown',
    keyCode: 25,
    label: 'volumeDown',
    group: 'system',
    icon: 'volume-down',
    repeatable: true,
  },
  {
    id: 'mute',
    keyCode: 164,
    label: 'mute',
    group: 'system',
    text: 'MUTE',
  },
  {
    id: 'volumeUp',
    keyCode: 24,
    label: 'volumeUp',
    group: 'system',
    icon: 'volume',
    repeatable: true,
  },
  {
    id: 'dpadUp',
    keyCode: 19,
    label: 'dpadUp',
    group: 'dpad',
    icon: 'arrow-up',
    repeatable: true,
  },
  {
    id: 'dpadRight',
    keyCode: 22,
    label: 'dpadRight',
    group: 'dpad',
    icon: 'arrow-right',
    repeatable: true,
  },
  {
    id: 'dpadDown',
    keyCode: 20,
    label: 'dpadDown',
    group: 'dpad',
    icon: 'arrow-up',
    repeatable: true,
  },
  {
    id: 'dpadLeft',
    keyCode: 21,
    label: 'dpadLeft',
    group: 'dpad',
    icon: 'arrow-left',
    repeatable: true,
  },
  {
    id: 'dpadCenter',
    keyCode: 23,
    label: 'dpadCenter',
    group: 'dpad',
    text: 'OK',
  },
  {
    id: 'back',
    keyCode: 4,
    label: 'back',
    group: 'navigation',
    icon: 'back',
  },
  {
    id: 'home',
    keyCode: 3,
    label: 'home',
    group: 'navigation',
    icon: 'circle',
  },
  {
    id: 'appSwitch',
    keyCode: 187,
    label: 'appSwitch',
    group: 'navigation',
    icon: 'square',
  },
  {
    id: 'menu',
    keyCode: 82,
    label: 'menu',
    group: 'navigation',
    text: 'MENU',
  },
  {
    id: 'mediaPrevious',
    keyCode: 88,
    label: 'mediaPrevious',
    group: 'media',
    text: '|◀',
  },
  {
    id: 'mediaRewind',
    keyCode: 89,
    label: 'mediaRewind',
    group: 'media',
    text: '◀◀',
    repeatable: true,
  },
  {
    id: 'mediaPlayPause',
    keyCode: 85,
    label: 'mediaPlayPause',
    group: 'media',
    text: '▶Ⅱ',
  },
  {
    id: 'mediaStop',
    keyCode: 86,
    label: 'mediaStop',
    group: 'media',
    text: '■',
  },
  {
    id: 'mediaFastForward',
    keyCode: 90,
    label: 'mediaFastForward',
    group: 'media',
    text: '▶▶',
    repeatable: true,
  },
  {
    id: 'mediaNext',
    keyCode: 87,
    label: 'mediaNext',
    group: 'media',
    text: '▶|',
  },
  {
    id: 'search',
    keyCode: 84,
    label: 'search',
    group: 'extra',
    text: '⌕',
  },
  {
    id: 'settings',
    keyCode: 176,
    label: 'settings',
    group: 'extra',
    icon: 'setting',
  },
  {
    id: 'pageUp',
    keyCode: 92,
    label: 'pageUp',
    group: 'extra',
    text: 'PG↑',
    repeatable: true,
  },
  {
    id: 'pageDown',
    keyCode: 93,
    label: 'pageDown',
    group: 'extra',
    text: 'PG↓',
    repeatable: true,
  },
  {
    id: 'info',
    keyCode: 165,
    label: 'info',
    group: 'tv',
    icon: 'info',
  },
  {
    id: 'channelUp',
    keyCode: 166,
    label: 'channelUp',
    group: 'tv',
    text: 'CH+',
    repeatable: true,
  },
  {
    id: 'channelDown',
    keyCode: 167,
    label: 'channelDown',
    group: 'tv',
    text: 'CH−',
    repeatable: true,
  },
  {
    id: 'guide',
    keyCode: 172,
    label: 'guide',
    group: 'tv',
    text: 'EPG',
  },
  {
    id: 'captions',
    keyCode: 175,
    label: 'captions',
    group: 'tv',
    text: 'CC',
  },
  {
    id: 'tvInput',
    keyCode: 178,
    label: 'tvInput',
    group: 'tv',
    text: 'INPUT',
  },
  ...Array.from({ length: 10 }, (_, number) => ({
    id: `digit${number}`,
    keyCode: 7 + number,
    label: `digit${number}`,
    group: 'number' as const,
    text: String(number),
  })),
] satisfies RemoteKeyDefinition[]

export const REMOTE_KEY_CODES = new Set(
  REMOTE_KEYS.map((key) => key.keyCode)
)

const REMOTE_KEY_GROUPS = REMOTE_KEYS.reduce(
  (groups, key) => {
    ;(groups[key.group] ||= []).push(key)
    return groups
  },
  {} as Record<RemoteKeyGroup, RemoteKeyDefinition[]>
)

export function getRemoteKeys(group: RemoteKeyGroup) {
  return REMOTE_KEY_GROUPS[group] ?? []
}

export function getRemoteKey(id: string) {
  return REMOTE_KEYS.find((key) => key.id === id)
}
