import hardhat from 'hardhat'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const [chainId, contractAddress] = process.argv.slice(2)

  console.log('chainId', chainId)
  console.log('contractAddress', contractAddress)
})()
