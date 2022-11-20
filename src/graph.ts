import { Node } from "./node";

import { Connection } from "./connection";

import { Property } from "./property";
import type { uuid } from "@/@types";

type propertyName = string;

// Reference Type

interface ReferenceByUuid {
  uuid: uuid;
  name?: never;
}
interface ReferenceByName {
  uuid?: never;
  name: string;
}
type reference = ReferenceByUuid | ReferenceByName;

export class Graph {
  private nodes: Map<uuid, Node> = new Map<uuid, Node>();
  private nodeUuids: Array<uuid> = new Array<uuid>();

  private connections: Map<propertyName, Map<uuid, Array<Connection>>> =
    new Map<propertyName, Map<uuid, Array<Connection>>>();

  private properties: Array<Property> = new Array<Property>();

  /**
   * Generates a new Node. Node generates a new UUID used to reference
   * the new Node.
   *
   * @param {string} name - Name of the new node
   * @param {number=} weight - Weight of the new node, or undefined will
   *    set a default weight of 1
   * @returns {Node} Returns the new Node object
   */

  public addNode(name: string, weight?: number): Node {
    const newNode = new Node(name, weight);

    this.nodes.set(newNode.uuid, newNode);
    this.nodeUuids.push(newNode.uuid);

    return newNode;
  }

  /**
   * Generates a new connection between a head and a tail node.
   *
   * Maps an existing property value against an exisiting Head UUID,
   * otherwise returns undefined. Head UUID maps an array of all connections.
   *
   * @param {string} from - The parent uuid
   * @param {string} to - The child uuid
   * @param {string} propertyName - Name of the property
   * @param {number=} weight - Weight of the new connection,
   *    or undefined will set a default weight of 1
   * @returns {Connection} Returns the new Connection object
   */

  public addConnection(
    from: uuid,
    to: uuid,
    propertyName: string,
    weight?: number
  ): Connection | undefined {
    const newConnection = new Connection(from, to, propertyName, weight);

    // Check if property exists
    if (
      !this.properties.find((e) => {
        return e.name == propertyName;
      })
    ) {
      console.warn(`${propertyName} does not exist`);
      return;
    }

    // Check if head uuid exists
    if (!this.nodes.has(from)) {
      console.warn(`Node with uuid ${from} does not exist`);
      return;
    }

    // Check if tail uuid exists
    if (!this.nodes.has(to)) {
      console.warn(`Node with uuid ${to} does not exist`);
      return;
    }

    if (this.connections.get(propertyName)?.size == 0) {
      this.connections.get(propertyName)?.set(from, [newConnection]);
    } else {
      this.connections.get(propertyName)?.get(from)?.push(newConnection);
    }

    return newConnection;
  }

  /**
   * Generates a new property object. Property is used to check against
   * when creating new connections between nodes.
   *
   * @param {string} name - Name of the property to be added.
   * @returns {Property} Returns the new property object.
   */

  public addProperty(name: string): Property {
    const newProperty = new Property(name);
    const property = this.getProperty(name);

    if (property) return property;

    this.properties.push(newProperty);
    this.connections.set(name, new Map<uuid, Array<Connection>>());

    return newProperty;
  }

  /**
   * Looks up a node by given UUID.
   *
   * @param {string} uuid - UUID for Node lookup.
   * @returns {Node|undefined} Returns the Node object if found,
   *    otherwise undefined.
   */

  public getNode(uuid: uuid): Node | undefined {
    const getNode = this.nodes.get(uuid);

    if (getNode == undefined) {
      console.warn(`Node with uuid ${uuid} does not exist`);
      return;
    }

    return getNode;
  }

  public getConnection(propertyName: string, from: string, to: string) {
    const getConnections: Connection[] | undefined = this.connections
      .get(propertyName)
      ?.get(from);

    const connections: Connection[] | undefined = getConnections?.filter(
      (e) => {
        e.to == to;
      }
    );

    if (connections == undefined) {
      console.debug(
        "No connections. To uuid, from uuid, or propertyName may not exist?"
      );
    }

    return connections;
  }

  /**
   * Looks up a property by given Name.
   *
   * @param name - Name for Property lookup.
   * @returns {Property|undefined} Returns the Property object if found,
   *    otherwise undefined.
   */

  public getProperty(name: string): Property | undefined {
    const getProperty = this.properties.find((e) => {
      return e.name == name;
    });

    if (getProperty == undefined) {
      return;
    }

    return getProperty;
  }

  /**
   * Gets all connections a node has. Can specify a property to return only
   * those values.
   *
   * @param {string} from - Uuid for looking up all associated connections.
   * @param {string=} propertyName - Optional property for looking up all
   *    associated connections with specific property.
   * @returns {Connection[]} Returns an array of all connections from
   *    given parameters.
   */
  public getAllConnections(from: uuid, propertyName?: string): Connection[] {
    // eslint-disable-next-line prefer-const
    let connections: Connection[] = [];

    // Push all connections with uuid
    if (propertyName == undefined) {
      this.connections.forEach((e) => {
        e.get(from)?.forEach((c) => {
          connections.push(c);
        });
      });
    }

    // Push all connections with uuid and propertyName
    if (propertyName != undefined) {
      this.connections.get(propertyName)?.forEach((e) => {
        e.forEach((c) => {
          connections.push(c);
        });
      });
    }

    if (connections.length == 0) {
      console.debug("No connections. Uuid or propertyName may not exist?");
    }

    return connections;
  }

  // public deleteNode(ref: reference) {}
  // public deleteConnection(ref: reference) {}
  // public deleteProperty(name: string) {}
}
