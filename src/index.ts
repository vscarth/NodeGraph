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
    nodes: new Map<uuid, Node>(),
    nodeKeys: new Array<uuid>(),
  },
  properties: {
    properties: new Array<Property>(),
    propertiesKey: new Map<string, number>(),
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

interface IAddNode {
  name: string;
  data?: object | undefined;
}

class GraphDB {
  // eslint-disable-next-line prefer-const
  private $store: State = new Store<State>(defaultState).$store;

  async AddNode({
    name,
    data,
  }: IAddNode): Promise<{ name: string; uuid: uuid }> {
    const newUuid: string = uuidv4();

    try {
      const newNode: Node = {
        uuid: newUuid,
        name: name,
        data: data ? data : undefined,
        properties: undefined,
      };

      await this.$store.nodes.nodeKeys.push(newUuid);
      await this.$store.nodes.nodes.set(newUuid, newNode);
    } catch (e) {
      console.error(e);
    }

    return { name: name, uuid: newUuid };
  }
}

const graph = new GraphDB();

graph.AddNode({ name: "alice" }).then((e) => {
  console.log(e);
});

graph.AddNode({ name: "alice2" }).then((e) => {
  console.log(e);
});
graph.AddNode({ name: "alice3" }).then((e) => {
  console.log(e);
});
graph.AddNode({ name: "alice4" }).then((e) => {
  console.log(e);
});
