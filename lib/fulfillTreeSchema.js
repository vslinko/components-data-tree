/* @flow */

import type {Resource, ResourceLink, ResourceRelationshipLink} from './jsonapiTypes'
import type {Tree, TreeSchema} from './types'

function readResource(resources: Array<Resource>, rootLink: ResourceLink, schema: TreeSchema): Tree {
  var resource = resources
    .filter(r => r.id === rootLink.id && r.type === rootLink.type)
    .shift()

  if (!resource) {
    return
  }

  var follow = function follow(relationshipLink: ResourceRelationshipLink, relationshipSchema: TreeSchema): Tree {
    return fulfillTreeSchema(resources, relationshipLink, relationshipSchema)
  }

  return schema(resource, follow)
}

function readResourceArray(resources: Array<Resource>, rootLinks: Array<ResourceLink>, schema: TreeSchema): Tree {
  return rootLinks.map(rootLink => readResource(resources, rootLink, schema))
}

export default function fulfillTreeSchema(resources: Array<Resource>, rootLink: ResourceRelationshipLink, schema: TreeSchema): Tree {
  if (Array.isArray(rootLink)) {
    return readResourceArray(resources, rootLink, schema)
  }

  if (rootLink) {
    return readResource(resources, rootLink, schema)
  }
}
