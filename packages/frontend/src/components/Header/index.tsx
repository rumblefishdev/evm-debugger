import type { HeaderProps } from './Header.types'

let ImportedHeader: React.FC<HeaderProps>
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImportedHeader = require('@rumblefishdev/ui/lib/src/components/Rumblefish23Theme/Header').Header
} catch {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImportedHeader = require('./Header.component').Header
}

export const Header = ImportedHeader
