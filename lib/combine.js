import intersection from 'lodash/array/intersection'
import difference from 'lodash/array/difference'
import merge from 'lodash/object/merge'

function mergeGetterResults(left, right) {
  if (!left) {
    return right
  }

  if (!right) {
    return left
  }

  if (left === right) {
    return right
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.lenght !== right.lenght) {
      throw new Error('Unable to merge two arrays with different length')
    }

    return left.map((l, index) => mergeGetterResults(l, right[index]))
  }

  if (typeof left === 'object' && typeof right === 'object') {
    var leftKeys = Object.keys(left)
    var rightKeys = Object.keys(right)

    var intersectionKeys = intersection(leftKeys, rightKeys)
    var leftDifferenceKeys = difference(leftKeys, rightKeys)
    var rightDifferenceKeys = difference(rightKeys, leftKeys)

    return merge({},
      intersectionKeys.reduce((acc, key) => {
        acc[key] = mergeGetterResults(left[key], right[key])
        return acc
      }, {}),

      leftDifferenceKeys.reduce((acc, key) => {
        acc[key] = left[key]
        return acc
      }, {}),

      rightDifferenceKeys.reduce((acc, key) => {
        acc[key] = right[key]
        return acc
      }, {})
    )
  }

  throw new Error(`Unable to merge "${JSON.stringify(left)}" and "${JSON.stringify(right)}"`)
}

export default function combine(...getters) {
  return (resource, key, follow) => {
    return getters.reduce((result, getter) => {
      return mergeGetterResults(
        result,
        getter(resource, key, follow)
      )
    }, null) // null-reasonable
  }
}
