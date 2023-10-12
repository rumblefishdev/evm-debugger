import { getExpandedNodes, parsePathsToMuiTreeView } from './structLogExplorer'

describe('parsePathsToMuiTreeView', () => {
  it('should place childs to the same ancestors', () => {
    const paths = [
      '@openzeppelin/contracts/token/ERC20/IERC20.sol',
      '@openzeppelin/contracts/token/ERC721/IERC721.sol',
      '@openzeppelin/contracts/utils/Context.sol',
    ]
    expect(parsePathsToMuiTreeView(paths)).toStrictEqual([
      {
        name: '@openzeppelin',
        id: '/@openzeppelin',
        children: [
          {
            name: 'contracts',
            id: '/@openzeppelin/contracts',
            children: [
              {
                name: 'token',
                id: '/@openzeppelin/contracts/token',
                children: [
                  {
                    name: 'ERC20',
                    id: '/@openzeppelin/contracts/token/ERC20',
                    children: [
                      {
                        name: 'IERC20.sol',
                        id: '/@openzeppelin/contracts/token/ERC20/IERC20.sol',
                        children: [],
                      },
                    ],
                  },
                  {
                    name: 'ERC721',
                    id: '/@openzeppelin/contracts/token/ERC721',
                    children: [
                      {
                        name: 'IERC721.sol',
                        id: '/@openzeppelin/contracts/token/ERC721/IERC721.sol',
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'utils',
                id: '/@openzeppelin/contracts/utils',
                children: [
                  {
                    name: 'Context.sol',
                    id: '/@openzeppelin/contracts/utils/Context.sol',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
  })

  it('should override existing nodes', () => {
    const paths = [
      '@openzeppelin/contracts/token/ERC20/IERC20.sol',
      '@openzeppelin/contracts/token/ERC721/IERC721.sol',
      '@openzeppelin/contracts/token/ERC20/IERC20.sol',
    ]
    expect(parsePathsToMuiTreeView(paths)).toStrictEqual([
      {
        name: '@openzeppelin',
        id: '/@openzeppelin',
        children: [
          {
            name: 'contracts',
            id: '/@openzeppelin/contracts',
            children: [
              {
                name: 'token',
                id: '/@openzeppelin/contracts/token',
                children: [
                  {
                    name: 'ERC20',
                    id: '/@openzeppelin/contracts/token/ERC20',
                    children: [
                      {
                        name: 'IERC20.sol',
                        id: '/@openzeppelin/contracts/token/ERC20/IERC20.sol',
                        children: [],
                      },
                    ],
                  },
                  {
                    name: 'ERC721',
                    id: '/@openzeppelin/contracts/token/ERC721',
                    children: [
                      {
                        name: 'IERC721.sol',
                        id: '/@openzeppelin/contracts/token/ERC721/IERC721.sol',
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
  })
})

describe('getExpandedNodes', () => {
  it('should return root if no paths', () => {
    expect(getExpandedNodes([])).toStrictEqual(['/'])
  })

  it('should return root and single path', () => {
    const paths = ['@openzeppelin/contracts/token/ERC20/IERC20.sol']
    expect(getExpandedNodes(paths)).toStrictEqual([
      '/',
      '/@openzeppelin',
      '/@openzeppelin/contracts',
      '/@openzeppelin/contracts/token',
      '/@openzeppelin/contracts/token/ERC20',
      '/@openzeppelin/contracts/token/ERC20/IERC20.sol',
    ])
  })

  it('should return root and multi path', () => {
    const paths = ['@openzeppelin/contracts/token/ERC20/IERC20.sol', '@openzeppelin/contracts/token/ERC721/IERC721.sol']

    expect(getExpandedNodes(paths)).toStrictEqual([
      '/',
      '/@openzeppelin',
      '/@openzeppelin/contracts',
      '/@openzeppelin/contracts/token',
      '/@openzeppelin/contracts/token/ERC20',
      '/@openzeppelin/contracts/token/ERC20/IERC20.sol',
      '/@openzeppelin/contracts/token/ERC721',
      '/@openzeppelin/contracts/token/ERC721/IERC721.sol',
    ])
  })

  it('should return root and multi path with already passed toggled list', () => {
    const paths = ['@openzeppelin/contracts/token/ERC20/IERC20.sol', '@openzeppelin/contracts/token/ERC721/IERC721.sol']
    const toggled = ['/src/Some.sol', '/@openzeppelin/utils/Context.sol']

    expect(getExpandedNodes(paths, toggled)).toStrictEqual([
      '/src/Some.sol',
      '/@openzeppelin/utils/Context.sol',
      '/',
      '/@openzeppelin',
      '/@openzeppelin/contracts',
      '/@openzeppelin/contracts/token',
      '/@openzeppelin/contracts/token/ERC20',
      '/@openzeppelin/contracts/token/ERC20/IERC20.sol',
      '/@openzeppelin/contracts/token/ERC721',
      '/@openzeppelin/contracts/token/ERC721/IERC721.sol',
    ])
  })

  it('should return different root with paths when root is passed', () => {
    const paths = ['@openzeppelin/contracts/token/ERC20/IERC20.sol', '@openzeppelin/contracts/token/ERC721/IERC721.sol']
    const toggled = ['/src/Some.sol', '/@openzeppelin/utils/Context.sol']
    const root = '-1'

    expect(getExpandedNodes(paths, toggled, root)).toStrictEqual([
      '/src/Some.sol',
      '/@openzeppelin/utils/Context.sol',
      '-1',
      '/@openzeppelin',
      '/@openzeppelin/contracts',
      '/@openzeppelin/contracts/token',
      '/@openzeppelin/contracts/token/ERC20',
      '/@openzeppelin/contracts/token/ERC20/IERC20.sol',
      '/@openzeppelin/contracts/token/ERC721',
      '/@openzeppelin/contracts/token/ERC721/IERC721.sol',
    ])
  })
})
