import type React from 'react'

let ImportedFooter: React.FC<Record<string, never>>
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImportedFooter = require('@rumblefishdev/ui/lib/src/components/Rumblefish23Theme/Footer').Footer
} catch {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImportedFooter = require('./Footer.component').Footer
}

export const Footer = ImportedFooter
