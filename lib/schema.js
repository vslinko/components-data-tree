/* @flow */

import type {Resource, ResourceRelationshipLink} from './jsonapiTypes'
import type {Tree, TreeObject, TreeSchema, TreeSchemaGetter, FollowRelationship} from './types'

export type DefineSchemaAttributes = {[key: string]: TreeSchemaGetter}
export type DefineSchema = (attributes: DefineSchemaAttributes) => TreeSchema

export function defineSchema(attributes: DefineSchemaAttributes): TreeSchema {
  var keys: Array<string> = Object.keys(attributes)

  return function(resource: Resource, follow: FollowRelationship): Tree {
    return keys.reduce(function(result: TreeObject, key: string): TreeObject {
      var getter: TreeSchemaGetter = attributes[key]

      result[key] = getter(resource, key, follow)

      return result
    }, {})
  }
}

export type Attribute = TreeSchemaGetter

export function attribute(resource: Resource, key: string, follow: FollowRelationship): Tree {
  if (key === 'id' || key === 'type') {
    return resource[key]
  } else if (resource.attributes && key in resource.attributes) {
    return resource.attributes[key]
  } else if (resource.relationships && key in resource.relationships) {
    throw new Error(`Key "${key}" is relationship but not attribute`)
  } else {
    throw new Error(`No attribute "${key}" found in "${JSON.stringify(resource)}"`)
  }
}

export type Relationship = (schema: TreeSchema) => TreeSchemaGetter

export function relationship(schema: TreeSchema): TreeSchemaGetter {
  return function(resource: Resource, key: string, follow: FollowRelationship): Tree {
    if (!resource.relationships || !resource.relationships[key]) {
      throw new Error(`No relationship "${key}" found in "${JSON.stringify(resource)}"`)
    }

    return follow(resource.relationships[key].data, schema)
  }
}
