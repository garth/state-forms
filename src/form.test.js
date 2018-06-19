/* eslint-env mocha */
import assert from 'assert'
import { Form, Field } from './form'

describe('form', () => {
  it('should create fields with default state', () => {
    const form = new Form({
      name: {
        value: 'Ben'
      }
    })
    assert.ok(form instanceof Form)
    assert.ok(form.name instanceof Field)
    assert.equal(form.name.value, 'Ben')
    assert.equal(form.name.isValid, true)
  })
  it('should validate initial form state', () => {
    const form = new Form({
      name: {
        value: 'Ben',
        defaultValue: 'Ben',
        validationRules: ['minLength:4']
      }
    })
    assert.ok(form instanceof Form)
    assert.ok(form.name instanceof Field)
    assert.equal(form.name.value, 'Ben')
    assert.equal(form.name.isValid, false)
    assert.deepEqual(form.name.validationRules, ['minLength:4'])
    assert.equal(form.name.requiredMessage, null)
    assert.equal(form.name.hasValue, true)
    assert.equal(form.name.isPristine, true)
    assert.equal(form.name.failedRule.name, 'minLength')
    assert.equal(form.name.failedRule.arg, 4)
  })
  it('should allow nested fields', () => {
    const form = new Form({
      address: {
        street: {
          value: ''
        },
        zipCode: {
          value: ''
        }
      }
    })
    assert.ok(form.address.street instanceof Field)
    assert.ok(form.address.zipCode instanceof Field)
    assert.equal(form.isValid, true)
    assert.equal(form.address.street.isValid, true)
    assert.equal(form.address.zipCode.isValid, true)
  })
  it('should allow list of fields', () => {
    const form = new Form({
      users: [
        {
          value: ''
        },
        {
          value: ''
        }
      ]
    })
    assert.ok(form.users[0] instanceof Field)
    assert.ok(form.users[1] instanceof Field)
    assert.equal(form.isValid, true)
    assert.equal(form.users[0].isValid, true)
    assert.equal(form.users[1].isValid, true)
  })
  it('should convert to json', () => {
    const form = new Form({
      users: [
        {
          value: 'Ben'
        },
        {
          value: 'Dopey'
        }
      ]
    })
    assert.deepEqual(form.toJSON(), {
      users: ['Ben', 'Dopey']
    })
  })
  it('should get invalid fields', () => {
    const form = new Form({
      users: [
        {
          value: 'Ben',
          validationRules: ['minLength:5']
        },
        {
          value: 'Dopey'
        }
      ]
    })
    const invalidFields = form.getInvalidFields()
    assert.equal(Object.keys(invalidFields)[0], 'users.0')
    assert.equal(invalidFields['users.0'].value, 'Ben')
  })
  it('should work with global props', () => {
    const form = new Form({
      name: {
        value: 'Ben'
      },
      showErrors: false,
      validationError: null
    })
    assert.ok(form instanceof Form)
    assert.equal(form.showErrors, false)
    assert.equal(form.validationError, null)
  })
  it('should return all fields', () => {
    const form = new Form({
      someField: {
        value: 'some field value'
      },
      otherField: {
        value: 'some other field'
      }
    })
    const fields = form.getFields()
    assert.equal(fields.someField.value, 'some field value')
    assert.equal(Object.keys(fields).length, 2)
  })
  describe('validate', () => {
    it('should validate using validationRules', () => {
      const form = new Form({
        name: {
          value: 'Ben',
          validationRules: ['isNumeric']
        }
      })
      assert.equal(form.isValid, false)
    })
    it('should validate with multiple rules', () => {
      const form = new Form({
        name: {
          value: 'Ben',
          validationRules: ['minLength:2', 'isNumeric']
        }
      })
      assert.equal(form.isValid, false)
      assert.equal(form.name.failedRule.name, 'isNumeric')
      assert.equal(form.name.failedRule.arg, undefined)
    })
    it('should validate required value', () => {
      const form = new Form({
        name: {
          value: '',
          isRequired: true
        }
      })
      assert.equal(form.isValid, false)
    })
    it('should validate required value using custom isValue rule', () => {
      const form = new Form({
        someField: {
          value: [],
          isRequired: true,
          isValueRules: ['minLength:1']
        }
      })
      assert.equal(form.isValid, false)
    })
    it('should validate using regexp', () => {
      const form = new Form({
        someField: {
          value: 'foo',
          isValueRules: [/foo/]
        }
      })
      assert.equal(form.isValid, true)
    })
    it('should validate with global props', () => {
      const form = new Form({
        name: {
          value: 'Ben',
          validationRules: ['minLength:3']
        },
        showErrors: false,
        validationError: null
      })
      assert.equal(form.isValid, true)
    })
  })
})
