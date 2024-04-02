const colorsRainbow = ['#B3C8CFBF', '#BED7DCBF', '#F1EEDCBF', '#E5DDC5BF', '#CCD3CABF', '#B5C0D0BF', '#F5E8DDBF', '#EED3D9BF']
const colorsMono = ['#B5C0D0FF', '#B5C0D0E6', '#B5C0D0CC', '#B5C0D0B3', '#B5C0D099', '#B5C0D080']

export const getRandomParametersColor = (parametersLength: number): string[] => {
  return Array.from({ length: parametersLength }, (_, __) => colorsMono[Math.floor(Math.random() * colorsMono.length)])
}
