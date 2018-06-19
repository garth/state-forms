import runValidation from './utils/runValidation'
import formToJSON from './helpers/formToJSON'
import getInvalidFormFields from './helpers/getInvalidFormFields'
import getFormFields from './helpers/getFormFields'

function createFields(form) {
  return Object.keys(form).reduce((fields, key) => {
    if (form[key] === Object(form[key])) {
      if ('value' in form[key]) {
        fields[key] = new Field(form[key], form)
      } else {
        fields[key] = createFields(form[key], form)
      }
    } else {
      fields[key] = form[key]
    }

    return fields
  }, {})
}

export class Field {
  constructor(field) {
    Object.assign(this, field, {
      isPristine: typeof field.isPristine === 'undefined' ? true : field.isPristine
    })
  }
  _validate(get) {
    return Object.assign(this, runValidation(this, get)).isValid
  }
}

export class Form {
  constructor(form, get) {
    Object.assign(this, createFields(form))
    this.isValid = this._validate(get)
  }
  _validate(get) {
    function validate(obj) {
      return Object.keys(obj).reduce((isValid, field) => {
        if (obj[field] instanceof Field) {
          const isFieldValid = obj[field]._validate(get)

          return isValid ? isFieldValid : false
        } else if (obj[field] === Object(obj[field])) {
          const areFieldsValid = validate(obj[field])

          return isValid ? areFieldsValid : false
        } else {
          return isValid
        }
      }, true)
    }

    return validate(this)
  }
  toJSON() {
    return formToJSON(this)
  }
  getInvalidFields() {
    return getInvalidFormFields(this)
  }
  getFields() {
    return getFormFields(this)
  }
}

export function computedField(fieldValueTag) {
  return Compute(fieldValueTag, (fieldValue, get) => {
    if (!fieldValue || typeof fieldValue !== 'object') {
      console.warn(`Cerebral Forms - Field value: ${fieldValueTag} did not resolve to an object`)
      return {}
    }
    const field = new Field(fieldValue)
    field._validate(get)
    return field
  })
}

export default function computedForm(formValueTag) {
  return Compute(formValueTag, (formValue, get) => {
    if (!formValue || typeof formValue !== 'object') {
      console.warn(`Cerebral Forms - Form value: ${formValueTag} did not resolve to an object`)
      return {}
    }

    return new Form(formValue, get)
  })
}
