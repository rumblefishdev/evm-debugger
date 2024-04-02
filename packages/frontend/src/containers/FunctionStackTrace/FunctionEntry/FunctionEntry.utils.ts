const colorsMono = ['#B5C0D0FF', '#B5C0D0E6', '#B5C0D0CC', '#B5C0D0B3', '#B5C0D099', '#B5C0D080']

export const getRandomParametersColor = (parametersLength: number): string[] => {
  return Array.from({ length: parametersLength }, (_, __) => colorsMono[Math.floor(Math.random() * colorsMono.length)])
}
