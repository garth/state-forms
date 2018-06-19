import rules from './rules'
// import resetForm from './helpers/resetForm'
// import formToJSON from './helpers/formToJSON'
export { default as rules } from './rules'
// export { Field, Form } from './form'

function Forms(options = {}) {
  if (options.rules) {
    Object.assign(rules, options.rules)
  }

  if (options.errorMessages) {
    rules._errorMessages = options.errorMessages
  }

  return {
    // get(path) {
    //   return this.context.resolve.value(form(state`${path}`))
    // },
    // reset(path) {
    //   this.context.state.set(path, resetForm(this.context.state.get(path)))
    // },
    // toJSON(path) {
    //   return formToJSON(this.context.state.get(path))
    // },
    updateRules(newRules) {
      Object.assign(rules, newRules)
    },
    updateErrorMessages(errorMessages) {
      Object.assign(rules._errorMessages, errorMessages)
    }
  }
}

export default Forms
