const colors = ['#B3C8CFBF', '#BED7DCBF', '#F1EEDCBF', '#E5DDC5BF', '#CCD3CABF', '#B5C0D0BF', '#F5E8DDBF', '#EED3D9BF']

export const getRandomParametersColor = (parametersLength: number): string[] => {
  return Array.from({ length: parametersLength }, (_, index) => colors[Math.floor(Math.random() * colors.length)])
}
