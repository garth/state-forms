import rules from './rules'
import { Field, Form } from './form'
export { default as rules } from './rules'

export const form = form => new Form(form)
export const field = field => new Field(field)

function Forms(options = {}) {
  if (options.rules) {
    Object.assign(rules, options.rules)
  }

  if (options.errorMessages) {
    rules._errorMessages = options.errorMessages
  }

  return {
    updateRules(newRules) {
      Object.assign(rules, newRules)
    },
    updateErrorMessages(errorMessages) {
      Object.assign(rules._errorMessages, errorMessages)
    }
  }
}

export default Forms
