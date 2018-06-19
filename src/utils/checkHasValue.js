import validate from './validate'

export default function checkHasValue(value, isValueRules) {
  const result = validate(value, isValueRules)
  return result.isValid
}
