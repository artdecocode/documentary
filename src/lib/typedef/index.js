/**
 * Return a name of a property with its default value, and surrounded by square brackets if default is given. If type is boolean or number, the default value is not surrounded by "".
 * @param {string} name Name of the property.
 * @param {*} defaultValue Default of the property.
 * @param {string} type Type of the property.
 * @example
 *
 * requiredParam
 * [optionalDefaultParam=false]
 * [optionalDefaultParamString='test']
 * [optionalParam]
 */
export const getNameWithDefault = (name, defaultValue, type) => {
  const hasDefault = defaultValue !== undefined
  if (!hasDefault) return name
  const d = ['number', 'boolean'].includes(type) ? defaultValue : `"${defaultValue}"`
  const n = `${name}=${d}`
  return n
}