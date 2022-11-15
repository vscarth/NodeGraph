import { uuid } from "./uuid";

import { Node } from "@/graph";

export interface Property {
  name: string; // Name of property
  uuid: uuid; // Property UUID
  nodes: Map<uuid, void>; // Nodes with this property by uuid
  relationships: Map<uuid, Array<uuid>>; // Map of relationships between nodes of this property by uuid
}

export interface Properties {
  properties: Array<Property>; // List of properties
  propertiesKey: Map<string, number>; // Map of property index by name for lookup
}
