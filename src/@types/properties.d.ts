import { uuid } from "./uuid";

import { Node } from "@/graph";

export interface Property {
  name: string; // Name of property
  uuid: uuid; // Property UUID
  nodes: Map<uuid, void>; // Nodes with this property by uuid
}

export interface Properties {
  properties: Array<Property>; // Store properties
  propertyKeyByName: Map<string, number>; // Property index in properties[] by name for lookup in properties[]
  propertyKeyByUUID: Map<uuid, number>; // Property index in properties[] by UUID for lookup in properties[]
}
