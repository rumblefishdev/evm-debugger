declare module 'solcv0.4.0' {
  export function compile(input: string, optimalization?: boolean): string
  export function compileStandard(input: string): string
}