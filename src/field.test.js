/* eslint-env mocha */
import assert from 'assert'
import { Field } from './form'

describe('field', () => {
  it('should not be a valid field due to required', () => {
    const nameField = new Field({
      value: '',
      isRequired: true
    })
    assert.ok(nameField instanceof Field)
    assert.equal(nameField.isValid, false)
    assert.equal(nameField.hasValue, false)
  })
  it('should be a valid field', () => {
    const nameField = new Field({
      value: 'Some name',
      isRequired: true
    })
    assert.ok(nameField instanceof Field)
    assert.equal(nameField.isValid, true)
    assert.equal(nameField.value, 'Some name')
  })
})
