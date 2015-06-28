/* @flow */

import type {Resource, ResourceRelationshipLink} from './jsonapiTypes'

export type TreeObject = {[key: string]: Tree}
export type TreeArray = Array<Tree>
export type Tree = TreeObject | TreeArray | boolean | number | string | void

export type FollowRelationship = (link: ResourceRelationshipLink, schema: TreeSchema) => Tree

export type TreeSchema = (resource: Resource, follow: FollowRelationship) => Tree
export type TreeSchemaGetter = (resource: Resource, key: string, follow: FollowRelationship) => Tree
