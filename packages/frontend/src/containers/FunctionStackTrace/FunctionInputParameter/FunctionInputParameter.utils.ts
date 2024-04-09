export const shortenValue = (value: string, isArray?: boolean) => {
  const lastCharsLength = isArray ? 4 : 3
  return value.length > 20 ? `${value.slice(0, 17)}...${value.slice(value.length - lastCharsLength, value.length)}` : value
}
