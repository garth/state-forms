import runValidation from './utils/runValidation'
import formToJSON from './helpers/formToJSON'
import getInvalidFormFields from './helpers/getInvalidFormFields'
import getFormFields from './helpers/getFormFields'

function createFields(form) {
  return Object.keys(form).reduce((fields, key) => {
    if (form[key] === Object(form[key])) {
      if ('value' in form[key]) {
        fields[key] = new Field(form[key], true)
      } else {
        fields[key] = createFields(form[key])
      }
    } else {
      fields[key] = form[key]
    }

    return fields
  }, {})
}

export class Field {
  constructor(field, skipValidate) {
    Object.assign(this, field, {
      isPristine: typeof field.isPristine === 'undefined' ? true : field.isPristine
    })
    if (!skipValidate) {
      this.isValid = this._validate()
    }
  }
  _validate() {
    return Object.assign(this, runValidation(this)).isValid
  }
}

export class Form {
  constructor(form) {
    Object.assign(this, createFields(form))
    this.isValid = this._validate()
  }
  _validate() {
    function validate(obj) {
      return Object.keys(obj).reduce((isValid, field) => {
        if (obj[field] instanceof Field) {
          const isFieldValid = obj[field]._validate()

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

// export function field(fieldValue) {
//   if (!fieldValue || typeof fieldValue !== 'object') {
//     console.warn(`Forms - Field value is not an object`)
//     return {}
//   }
//   const field = new Field(fieldValue)
//   field._validate()
//   return field
// }
//
// export default function form(formValue) {
//   if (!formValue || typeof formValue !== 'object') {
//     console.warn(`Forms - Form value is not an object`)
//     return {}
//   }
//
//   return new Form(formValue)
// }
