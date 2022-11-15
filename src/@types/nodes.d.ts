import { uuid } from "./uuid";

export type head = Node;
export type tail = Node;

export interface Node {
  uuid: uuid;
  name: string | undefined;
  data: object | undefined; // Unconstrained data stored as object
}

export interface Nodes {
  nodes: Map<uuid, Node>; // Store nodes by uuid
  nodeKeys: uuid[]; // Store all node uuids for indexing
}
