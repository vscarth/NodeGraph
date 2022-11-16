// import "./style.css";
import log from "loglevel";
import { v4 as uuidv4 } from "uuid";

import type {
  Node,
  Nodes,
  Property,
  Properties,
  uuid,
  NodeProperty,
} from "./@types";

// Declare state

interface State {
  nodes: Nodes;
  properties: Properties;
}

// Default states

const defaultState: State = {
  nodes: {
    nodes: new Array<Node>(),
    nodesKeyByName: new Map<string, number>(),
    nodesKeyByUUID: new Map<uuid, number>(),
  },
  properties: {
    properties: new Array<Property>(),
    propertyKeyByName: new Map<string, number>(),
    propertyKeyByUUID: new Map<uuid, number>(),
  },
};

class Store<S> {
  private _$store!: S;

  public get $store(): S {
    return this._$store;
  }

  private set $store(v: S) {
    this._$store = v;
  }

  constructor(state: S) {
    this.$store = state;
  }
}

// interface ICommit {
//   data: object,
//   path: Paths<>
// }

interface ILookupNode {
  nodeLabel?: string | number | object;
  nodeUuid?: uuid;
}

interface ILookupProperty {
  propertyName?: string;
  propertyUuid?: uuid;
}

interface IAddNode {
  label: string;
  data?: object | undefined;
}

interface IAddProperty {
  name: string;
}

interface IAddPropertyToNode {
  propertyName: string;
  propertyUuid: uuid;
  nodeLabel?: string | number | object;
  nodeUuid?: uuid;
}

interface IAddDirectedRelationship {
  headNodeLabel?: string | number | object;
  headNodeUuid?: uuid;
  tailNodeLabel?: string | number | object;
  tailNodeUuid?: uuid;
  propertyName?: string;
  propertyUuid?: uuid;
}

class GraphDB {
  // eslint-disable-next-line prefer-const
  private $store: State = new Store<State>(defaultState).$store;

  /**
   * Looks up a node by label or uuid, or both. Checks to make sure the uuid or label exist for lookup, with error assertion.
   * Returns the node and index of the node in the nodes array.
   * 
   * @param {string | number | object} nodeLabel - Label of the node to lookup
   * @param {string} nodeUuid - Uuid of the node to lookup
   * @returns {{ index: number; property: Property } | undefined} - Return index of property in array, and property itself. Undefined if invalid search parameters.
  >}
   */
  public LookupNode({
    nodeLabel,
    nodeUuid,
  }: ILookupNode): { index: number; node: Node } | undefined {
    try {
      if (!nodeLabel && !nodeUuid)
        throw new Error("Atleast one parameter is required in LookupNode()");

      if (nodeLabel) {
        const key = this.$store.nodes.nodesKeyByName.get(nodeLabel);

        if (
          key == undefined &&
          nodeLabel == undefined &&
          !nodeUuid == undefined
        ) {
          throw new Error(`NodeLabel ${nodeLabel} does not exist`);
        } else {
          if (key) {
            const node = this.$store.nodes.nodes[key];

            return { index: key, node: node };
          }
        }
      }

      if (nodeUuid) {
        const key = this.$store.nodes.nodesKeyByName.get(nodeUuid);

        if (
          key == undefined &&
          nodeLabel == undefined &&
          !nodeLabel == undefined
        ) {
          throw new Error(`NodeUuid ${nodeUuid} does not exist`);
        } else {
          if (key) {
            const node = this.$store.nodes.nodes[key];

            return { index: key, node: node };
          }
        }
      }

      if (nodeLabel && nodeUuid) {
        throw new Error(
          `NodeUuid ${nodeUuid} and NodeName ${nodeLabel} do not exist`
        );
      }
    } catch (e) {
      log.error(e);
      return;
    }
    return;
  }

  /**
   * Looks up a property by name or uuid, or both. Checks to make sure the uuid or name exist for lookup, with error assertion.
   * Returns the property and index of the property in the properties array.
   * 
   * @param {string} propertyName - Name of the property to lookup
   * @param {string} propertyUuid - Uuid of the property to lookup
   * @returns {{ index: number; property: Property } | undefined} - Return index of property in array, and property itself. Undefined if invalid search parameters.
  >}
   */
  public LookupProperty({
    propertyName,
    propertyUuid,
  }: ILookupProperty): { index: number; property: Property } | undefined {
    try {
      if (!propertyName && !propertyUuid)
        throw new Error(
          "Atleast one parameter is required in LookupProperty()"
        );

      if (propertyName) {
        const key = this.$store.properties.propertyKeyByName.get(propertyName);

        if (
          key == undefined &&
          propertyName == undefined &&
          !propertyUuid == undefined
        ) {
          throw new Error(`PropertyName ${propertyName} does not exist`);
        } else {
          if (key) {
            const property = this.$store.properties.properties[key!];

            return { index: key!, property: property };
          }
        }
      }

      if (propertyUuid) {
        const key = this.$store.properties.propertyKeyByName.get(propertyUuid);

        if (
          key == undefined &&
          propertyUuid == undefined &&
          !propertyName == undefined
        ) {
          throw new Error(`PropertyUuid ${propertyUuid} does not exist`);
        } else {
          if (key) {
            const property = this.$store.properties.properties[key!];

            return { index: key!, property: property };
          }
        }
      }

      if (propertyName && propertyUuid) {
        throw new Error(
          `PropertyUuid ${propertyUuid} and PropertyName ${propertyName} do not exist`
        );
      }
    } catch (e) {
      log.error(e);
      return;
    }
    return;
  }

  /**
   * Creates a new node object and adds it to the node store map, using UUID as key.
   * Adds UUID to nodeKeys array for indexing.
   *
   * @param {string|number|object} label - The label used to reference the Node.
   * @param {object|undefined} data - Unconstrained data stored as object.
   * @returns {Node|undefined} - Returns the newly created node, or undefined if error.
   */
  public AddNode({ label, data }: IAddNode): { node: Node } | undefined {
    const newUuid: string = uuidv4();

    const newNode: Node = {
      uuid: newUuid,
      label: label,
      data: data ? data : undefined,
      properties: new Array<NodeProperty>(),
    };

    try {
      this.$store.nodes.nodes.push(newNode);

      const key = this.$store.nodes.nodes.length;

      this.$store.nodes.nodesKeyByName.set(label, key);
      this.$store.nodes.nodesKeyByUUID.set(newUuid, key);
    } catch (e) {
      log.error(e);
      return;
    }

    return { node: newNode };
  }

  /**
   *  Creates a new property object and adds it to the properties array.
   *  Adds UUID to properties key map to lookup position of property in array, for O(n) performace.
   *
   * @param {string} name - The name of the new property
   * @returns {Property|undefined} - Returns the newly created property, or undefined if error.
   */
  public AddProperty({
    name,
  }: IAddProperty): { property: Property } | undefined {
    const newUuid: string = uuidv4();

    const newProperty: Property = {
      name: name,
      uuid: newUuid,
    };

    try {
      this.$store.properties.properties.push(newProperty);

      const key = this.$store.properties.properties.length;

      this.$store.properties.propertyKeyByName.set(name, key);
      this.$store.properties.propertyKeyByUUID.set(newUuid, key);
    } catch (e) {
      log.error(e);
      return;
    }

    return { property: newProperty };
  }

  /**
   *
   * @param {string} propertyName - Name of the property to lookup
   * @param {string} propertyUuid - Uuid of the property to lookup
   * @param {string|number|object} nodeLabel - Name of the property to lookup
   * @param {string} nodeUuid - Uuid of the property to lookup
   */
  public AddPropertyToNode({
    propertyName,
    propertyUuid,
    nodeLabel,
    nodeUuid,
  }: IAddPropertyToNode): void {
    const nodeLookup = this.LookupNode({
      nodeLabel: nodeLabel,
      nodeUuid: nodeUuid,
    });

    const propertyLookup = this.LookupProperty({
      propertyName: propertyName,
      propertyUuid: propertyUuid,
    });

    // Error if item dosen't exist
    if (nodeLookup == undefined || propertyLookup == undefined) {
      let error = "";

      if (nodeLookup == undefined)
        error += error
          ? `and Node ${nodeLabel}${nodeUuid}`
          : `Node ${nodeLabel}${nodeUuid}`;

      if (propertyLookup == undefined)
        error += error
          ? `and Property ${propertyName}${propertyUuid}`
          : `Property ${propertyName}${propertyUuid}`;

      error += " does not exist.";

      log.error(error);
      return;
    }

    if (
      this.$store.nodes.nodes[nodeLookup.index].properties.find(
        (e) => e.name === propertyLookup.property.name
      )
    ) {
      log.error(
        `Node ${nodeLookup.node.label} already contains property ${propertyLookup.property.name}`
      );

      return;
    }

    if (nodeLookup != undefined && propertyLookup != undefined) {
      const newNodeProperty: NodeProperty = {
        name: propertyLookup.property.name,
        propertyUuid: propertyLookup.property.uuid,
        relationships: new Array<uuid>(),
      };

      this.$store.nodes.nodes[nodeLookup.index].properties.push(
        newNodeProperty
      );
    }
  }

  public AddDirectedRelationship({
    headNodeUuid,
    tailNodeUuid,
    headNodeLabel,
    tailNodeLabel,
    propertyName,
    propertyUuid,
  }: IAddDirectedRelationship): void {
    const headNodeLookup = this.LookupNode({
      nodeLabel: headNodeLabel,
      nodeUuid: headNodeUuid,
    });
    const tailNodeLookup = this.LookupNode({
      nodeLabel: tailNodeLabel,
      nodeUuid: tailNodeUuid,
    });
    const propertyLookup = this.LookupProperty({
      propertyName: propertyName,
      propertyUuid: propertyUuid,
    });

    // Error if item dosen't exist
    if (
      headNodeLookup == undefined ||
      tailNodeLookup == undefined ||
      propertyLookup == undefined
    ) {
      let error = "";

      if (headNodeLookup == undefined)
        error += error
          ? `and Node ${headNodeLabel}${headNodeUuid}`
          : `Node ${headNodeLabel}${headNodeUuid}`;

      if (tailNodeLookup == undefined)
        error += error
          ? `and Node ${tailNodeLabel}${tailNodeLabel}`
          : `Node ${tailNodeLabel}${tailNodeUuid}`;

      if (propertyLookup == undefined)
        error += error
          ? `and Property ${propertyName}${propertyUuid}`
          : `Property ${propertyName}${propertyUuid}`;

      error += " does not exist.";

      log.error(error);
      return;
    }

    // Error if property dosen't exist on item
    if (
      !this.$store.nodes.nodes[headNodeLookup.index].properties.find(
        (e) => e.name === propertyLookup.property.name
      ) ||
      !this.$store.nodes.nodes[tailNodeLookup.index].properties.find(
        (e) => e.name === propertyLookup.property.name
      )
    ) {
      log.error(
        `Node ${headNodeLookup.node.label} or ${tailNodeLookup.node.label} does not contain property ${propertyLookup.property.name}`
      );

      return;
    }

    this.$store.nodes.nodes[headNodeLookup.index].properties[
      propertyLookup.index
    ].relationships.push(tailNodeLookup.node.uuid);
  }
}
