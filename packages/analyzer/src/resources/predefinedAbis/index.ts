import { ethers } from 'ethers'

import { ERC1155_ABI } from './erc1155'
import { ERC20_ABI } from './erc20'
import { ERC721_ABI } from './erc721'

export const cachedAbis = {
  ERC1155: new ethers.utils.Interface(ERC1155_ABI),
  ERC721: new ethers.utils.Interface(ERC721_ABI),
  ERC20: new ethers.utils.Interface(ERC20_ABI),
}
