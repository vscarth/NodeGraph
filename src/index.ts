// import "./style.css";
import log from "loglevel";
import { v4 as uuidv4 } from "uuid";

import type { Node, Nodes, Property, Properties, uuid } from "./@types";

// Declare state

interface State {
  nodes: Nodes;
  properties: Properties;
}

// Default states

const defaultState: State = {
  nodes: {
    nodes: new Array<Property>(),
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
//   path: Paths<typeof >
// }

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

class GraphDB {
  // eslint-disable-next-line prefer-const
  private $store: State = new Store<State>(defaultState).$store;

  /**
   * Looks up a property by name or uuid, or both. Checks to make sure the uuid or name exist for lookup with error assertion.
   * Returns the property and index of the property in the propertis array.
   * 
   * @param {string} propertyName - Name of the property to lookup
   * @param {string} propertyUuid - Uuid of the property to lookup
   * @returns {Promise<{ index: number; property: Property } | undefined>} - Return index of property in array, and property itself. Undefined if invalid search parameters.
  >}
   */
  public async LookupProperty({
    propertyName,
    propertyUuid,
  }: ILookupProperty): Promise<
    { index: number; property: Property } | undefined
  > {
    try {
      if (!propertyName && !propertyUuid)
        throw new Error(
          "Atleast one parameter is required in LookupProperty()"
        );

      if (propertyName) {
        const key = this.$store.properties.propertyKeyByName.get(propertyName);

        if (
          typeof key == undefined &&
          typeof propertyName == undefined &&
          !propertyUuid == undefined
        ) {
          throw new Error(`PropertyName ${propertyName} does not exist`);
        } else {
          const property = this.$store.properties.properties[key!];

          return { index: key!, property: property };
        }
      }

      if (propertyUuid) {
        const key = this.$store.properties.propertyKeyByName.get(propertyUuid);

        if (
          typeof key == undefined &&
          typeof propertyName == undefined &&
          !propertyName == undefined
        ) {
          throw new Error(`PropertyUuid ${propertyUuid} does not exist`);
        } else {
          const property = this.$store.properties.properties[key!];

          return { index: key!, property: property };
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
   * @returns {Promise<Node|undefined>} - Returns the newly created node, or undefined if error.
   */
  public async AddNode({
    label,
    data,
  }: IAddNode): Promise<{ node: Node } | undefined> {
    const newUuid: string = uuidv4();

    const newNode: Node = {
      uuid: newUuid,
      label: label,
      data: data ? data : undefined,
      properties: undefined,
    };

    try {
      await this.$store.nodes.nodes.push(newNode);

      const key = this.$store.nodes.nodes.length;

      await this.$store.nodes.nodesKeyByName.set(label, key);
      await this.$store.nodes.nodesKeyByUUID.set(newUuid, key);
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
   * @returns {Promise<Property|undefined>} - Returns the newly created property, or undefined if error.
   */
  public async AddProperty({
    name,
  }: IAddProperty): Promise<{ property: Property } | undefined> {
    const newUuid: string = uuidv4();

    const newProperty: Property = {
      name: name,
      uuid: newUuid,
      nodes: new Map<uuid, void>(),
    };

    try {
      await this.$store.properties.properties.push(newProperty);

      const key = this.$store.properties.properties.length;

      await this.$store.properties.propertyKeyByName.set(name, key);
      await this.$store.properties.propertyKeyByUUID.set(newUuid, key);
    } catch (e) {
      log.error(e);
      return;
    }

    return { property: newProperty };
  }

  public async AddPropertyToNode({});

  public async AddRelationship({});
}

const graph = new GraphDB();

graph.AddNode({ name: "alice" }).then((e) => {
  console.log(e);
});
