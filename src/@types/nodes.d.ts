import { uuid } from "./uuid";

export type head = Node;
export type tail = Node;

export interface Node {
  uuid: uuid; // UUID of node
  label: string | number | object; // Name of node
  data: object | undefined; // Unconstrained data stored as object
  properties:
    | Array<{
        name: string; // Name of property
        propertyUuid: uuid; // UUID of property
        relationships: Array<uuid>; // Relationships to other nodes by node UUID
      }>
    | undefined;
}

export interface Nodes {
  nodes: Map<uuid, Node>; // Store nodes by uuid
  nodeKeys: uuid[]; // Store all node uuids for indexing
}
