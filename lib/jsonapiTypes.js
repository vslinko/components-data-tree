/* @flow */

export type ResourceType = string
export type ResourceId = string

export type ResourceLink = {
  type: ResourceType,
  id: ResourceId
}

export type ResourceAttribute = {[key: string]: ResourceAttribute} | Array<ResourceAttribute> | boolean | number | string | void

export type ResourceAttributes = {
  [key: string]: ResourceAttribute
}

export type ResourceRelationshipLink = ResourceLink | Array<ResourceLink> | void

export type ResourceRelationship = {
  data: ResourceRelationshipLink
}

export type ResourceRelationships = {
  [key: string]: ResourceRelationship
}

export type Resource = {
  type: ResourceType,
  id: ResourceId,
  attributes: ResourceAttributes,
  relationships: ResourceRelationships
}
