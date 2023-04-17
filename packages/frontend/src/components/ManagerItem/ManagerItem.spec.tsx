import * as React from 'react'
import renderer from 'react-test-renderer'

import { ManagerItem } from './ManagerItem'
import { StyledName } from './styles'

describe('ManagerItem tests', () => {
  it('simpel render', () => {
    const expectedText = 'sampleName'
    const render = renderer.create(
      <ManagerItem
        key="0x1"
        address="0x2"
        name={expectedText}
        value="sampleValue"
        isFound={false}
        updateItem={null}
      />,
    )
    const testInstance = render.root.findByType(StyledName)
    expect(testInstance.props.children).toEqual(expectedText)
    expect(render.toJSON()).toMatchSnapshot()
  })

  it('display address instead', () => {
    const expectedText = '0x2'
    const render = renderer.create(
      <ManagerItem
        key="0x1"
        address={expectedText}
        value="sampleValue"
        isFound={false}
        updateItem={null}
        name={null}
      />,
    )
    const testInstance = render.root.findByType(StyledName)
    expect(testInstance.props.children).toEqual(expectedText)
  })
})
