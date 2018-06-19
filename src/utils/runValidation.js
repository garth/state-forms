import checkHasValue from './checkHasValue'
import validate from './validate'

export default function runValidation(field) {
  const isValueRules = field.isValueRules || ['isValue']
  const hasValue = checkHasValue(field.value, isValueRules)
  const result = validate(field.value, field.validationRules)
  const isValid = result.isValid && ((field.isRequired && hasValue) || !field.isRequired)

  const validationResult = {
    isValid,
    hasValue: checkHasValue(field.value, isValueRules),
    failedRule: result.failedRule
  }

  if (result.errorMessage) {
    validationResult.errorMessage = result.errorMessage
  }

  return validationResult
}
