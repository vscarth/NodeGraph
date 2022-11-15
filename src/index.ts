// import "./style.css";
import log from "loglevel";
import { v4 as uuidv4 } from "uuid";

import type { Node, Nodes, Property, Properties, uuid } from "@/@types/";

// Declare state

interface State {
  nodes: Nodes;
  properties: Properties;
}

// Default states

const defaultState: State = {
  nodes: {
    nodes: new Map<uuid, Node>(),
    nodeKeys: new Array<uuid>(),
  },
  properties: {
    properties: new Array<Property>(),
    propertiesKey: new Map<string, number>(),
  },
};

const defaultNode: Node = {
  uuid: "",
  name: undefined,
  data: undefined,
};

const defaultProperty: Property = {
  name: "",
  uuid: "",
  nodes: new Map<uuid, void>(),
  relationships: new Map<uuid, Array<uuid>>(),
};

// State

// eslint-disable-next-line prefer-const
let state: State = defaultState;

// Graph function

// interface FuncKeysMap<S> {
//   [k: string]: (state: S, ...args: any[]) => any;
// }

// enum GetterTypes {
//   GET_PROPERTY = "GET_PROPERTY",
//   GET_NODE = "GET_PROPERTIES",
// }

// interface Getters<S = State> {
//   [GetterTypes.GET_PROPERTY](state: S, name: string): Property | undefined;
//   [GetterTypes.GET_NODE](state: S, uuid: uuid): Node | undefined;
// }

// const getters: FuncKeysMap<State> & Getters = {
//   [GetterTypes.GET_PROPERTY](state: State, name: string): Property | undefined {
//     const k = state.properties.propertiesKey.get(name);

//     if (!k) {
//       log.warn(`Property ${name} does not exist`);
//       return;
//     }

//     return state.properties.properties[k];
//   },

//   [GetterTypes.GET_NODE](state: State, uuid: uuid): Node | undefined {
//     const v = state.nodes.nodes.get(uuid);

//     if (!v) {
//       log.warn(`Node ${uuid} does not exist`);
//       return;
//     }

//     return v;
//   },
// };

// //

// enum SetterTypes {
//   SET_NODE = "SET_NODE",
//   EDIT_NODE_DATA = "EDIT_DATA",
//   SET_PROPERTY = "SET_PROPERTY",
//   ADD_ADJACENCY = "ADD_ADJACENCY",
// }

// interface Setters<S = State> {
//   [SetterTypes.SET_NODE](state: S, name?: string, data?: object): void;
//   [SetterTypes.EDIT_NODE_DATA](state: S, uuid: uuid, data: object): void;
//   [SetterTypes.SET_PROPERTY](state: s): void;
//   [SetterTypes.ADD_ADJACENCY](state: S): void;
// }

// const setters: FuncKeysMap<State> & Setters = {
//   [SetterTypes.SET_NODE](state: State, name?: string, data?: object): void {
//     const uuid: string = uuidv4();
//     const node: Node = {
//       uuid: uuid,
//       name: name,
//       data: data,
//     };

//     state.nodes.nodes.set(uuid, node);
//     state.nodes.nodeKeys.push(uuid);
//   },

//   [SetterTypes.EDIT_NODE_DATA](state: State, uuid: uuid, data: object): void {
//     const v = state.nodes.nodes.get(uuid);

//     if (!v) {
//       log.warn(`Node ${uuid} does not exist`);
//       return;
//     }

//     return v;
//   },
// };

// type tree = {
//   setters: {
//     [K in keyof Setters]: ReturnType<Setters[K]>;
//   };
//   getters: {
//     [K in keyof Getters]: ReturnType<Getters[K]>;
//   };
// };

// enum Actions {}

// interface Actions {

// }

// class Graph extends GettersConstructor {
//   this.getters: = {}
//   private registerGetters(): {

//   }
// }

// const g = new Graph();

// g[GetterTypes.GET_NODE]();

// state.nodes.nodes.set("abc", defaultNode);
// state.properties[0].

/**
 * Helper class for creating a store
 * @param {S} S - Generic for store template. Should be of object type
 */

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

/**
 * Wrapper class for accessors to the graph store
 */

interface IAddNode {
  name?: string;
  data?: object;
}

interface IAddProperty {
  propertyName: string;
}

interface IAddRelationship {
  propertyName: string;
  head: uuid;
  tail: uuid;
}

interface IAddPropertyToNode {
  propertyName: string;
  uuid: uuid;
}

class GraphStore {
  public $store: State;

  constructor() {
    this.$store = new Store<State>(defaultState).$store;
  }

  /**
   * Checks if node exist by UUID
   *
   * @param {string} uuid - UUID of node
   * @returns {Node | Undefined} Return node if exist
   */

  public GetNode(uuid: uuid): Node | undefined {
    const node = this.$store.nodes.nodes.get(uuid);

    if (!node) {
      log.warn(`Node ${uuid} does not exist`);

      return undefined;
    }

    return node;
  }

  /**
   * Checks if a property exist by Name
   *
   * @param {string} name - Name of property
   * @returns {boolean} - Return true if property exist
   */

  public PropertyExist(name: string): boolean {
    const propertyExist = this.$store.properties.propertiesKey.has(name);

    if (!propertyExist) {
      log.warn(`Node ${name} does not exist`);

      return false;
    }

    return true;
  }

  /**
   * Checks if a node contains a property
   *
   * @param name - Name of property
   * @param uuid - UUID of node
   * @returns {boolean} Return true if node contains property
   */

  public ContainsProperty(name: string, uuid: uuid): boolean {
    const propertyExist = this.PropertyExist(name);
    const GetNode = this.GetNode(uuid);

    if (!propertyExist || !GetNode) {
      log.warn(`Node ${uuid} does not contain property ${name}`);

      return false;
    }

    const key = this.$store.properties.propertiesKey.get(name);

    if (key != undefined) {
      const exist = this.$store.properties.properties[key].nodes.has(uuid);

      if (!exist) {
        log.warn(`Node ${uuid} does not contain property ${name}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Adds a new node, generating a new UUID
   *
   * @param {string} name - Name of node
   * @param {object} data - Data of node
   * @returns {string} Return new uuid
   */
  public AddNode({ name, data }: IAddNode): uuid {
    const uuid: string = uuidv4();
    const newNode: Node = {
      uuid: uuid,
      name: name,
      data: data,
    };

    this.$store.nodes.nodes.set(uuid, newNode);
    this.$store.nodes.nodeKeys.push(uuid);

    return uuid;
  }

  /**
   * Creates a newly available property to be assigned to nodes
   *
   * @param {string} propertyName - Name of new property
   */
  public AddProperty({ propertyName }: IAddProperty): void {
    const uuid: string = uuidv4();
    const newProperty: Property = {
      name: propertyName,
      uuid: uuid,
      nodes: new Map<uuid, void>(),
      relationships: new Map<uuid, Array<uuid>>(),
    };

    const index: number = this.$store.properties.properties.length;

    this.$store.properties.properties.push(newProperty);
    this.$store.properties.propertiesKey.set(propertyName, index);
  }

  /**
   * Adds a property to a node
   *
   * @param {string} propertyName - Name of property
   * @param {string} uuid - UUID of node
   */
  public AddPropertyToNode({ propertyName, uuid }: IAddPropertyToNode): void {
    // Checkers
    if (!this.GetNode(uuid)) return;
    if (!this.PropertyExist(propertyName)) return;

    const key = this.$store.properties.propertiesKey.get(propertyName);

    if (key != undefined) {
      this.$store.properties.properties[key].nodes.set(uuid);
    }
  }

  /**
   * Adds a directed relationship between two nodes
   *
   * @param {string} propertyName - Name of property
   * @param {string} head - UUID of head node
   * @param {string} tail - UUID of tail node
   */
  public AddDirectedRelationship({
    propertyName,
    head,
    tail,
  }: IAddRelationship): void {
    // Checkers
    if (!this.GetNode(head) || !this.GetNode(tail)) return;
    if (!this.PropertyExist(propertyName)) return;

    const key = this.$store.properties.propertiesKey.get(propertyName);

    if (!this.ContainsProperty(propertyName, head)) return;
    if (!this.ContainsProperty(propertyName, tail)) return;

    if (key != undefined) {
      const nodeHasRelationships =
        this.$store.properties.properties[key].relationships.get(head);
      // this.$store.properties.properties[key].relationships.set()
      if (!nodeHasRelationships) {
        this.$store.properties.properties[key].relationships.set(head, []);
      }

      this.$store.properties.properties[key].relationships
        .get(head)
        ?.push(tail);
    }
  }

  // public GetNode() {

  // }

  // public GetProperty() {

  // }
}

class GraphPrinter {
  public PrintGraph(state: State) {
    const nodes = state.nodes.nodes;

    // eslint-disable-next-line prefer-const

    state.properties.properties.forEach((property) => {
      const nodePropertyArr: any = [];

      console.log(`${property.name} -`);

      property.relationships.forEach((relationship, uuid) => {
        nodePropertyArr.push({ node: uuid, relationships: relationship });
      });

      console.log(...nodePropertyArr);
    });
  }
}

// class Graph {
//   private $store = new GraphStore();
// }

const graph = new GraphStore();

const user1 = graph.AddNode({ name: "alice" });
const user2 = graph.AddNode({ name: "elliot" });

graph.AddProperty({ propertyName: "friends" });
graph.AddPropertyToNode({ propertyName: "friends", uuid: user1 });
graph.AddPropertyToNode({ propertyName: "friends", uuid: user2 });
graph.AddDirectedRelationship({
  propertyName: "friends",
  head: user1,
  tail: user2,
});
// FIX DOUBLE ENTRY
graph.AddDirectedRelationship({
  propertyName: "friends",
  head: user1,
  tail: user2,
});

graph.AddDirectedRelationship({
  propertyName: "friends",
  head: user2,
  tail: user2,
});

const print = new GraphPrinter();

print.PrintGraph(graph.$store);
