import { uuid } from "./uuid";

export type head = Node;
export type tail = Node;

export interface NodeProperty {
  name: string; // Name of property
  propertyUuid: uuid; // UUID of property
  relationships: Array<uuid>; // Relationships to other nodes by node UUID
}

export interface Node {
  uuid: uuid; // UUID of node
  label: string | number | object; // Name of node
  data: object | undefined; // Unconstrained data stored as object
  properties: Array<NodeProperty>;
}

export interface Nodes {
  nodes: Array<Node>; // Store nodes
  nodesKeyByName: Map<string | number | object, number>; // Node index in nodes[] by name for lookup in nodes[]
  nodesKeyByUUID: Map<uuid, number>; // Node index in nodes[] by UUID for lookup in nodes[]
}
