import * as React from 'react'
import renderer from 'react-test-renderer'

import { ManagerItem } from './ManagerItem'
import { StyledName } from './styles'

describe('ManagerItem tests', () => {
  it('simple render', () => {
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
    console.log(render.toJSON())
    expect(render.toJSON()).toMatchSnapshot()
  })

  it('display address if name not exist', () => {
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
