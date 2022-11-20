import { v4 as uuidv4 } from "uuid";

import type { uuid } from "@/@types";

import { Weight } from "./weight";

interface INode {
  name: string;
  uuid: string;
}

export class Node extends Weight implements INode {
  private _uuid: uuid; // UUID of node
  private _name: string; // Name of node

  public get uuid(): uuid {
    return this._uuid;
  }

  public get name(): string {
    return this._name;
  }

  constructor(name: string, weight: number | undefined) {
    super(weight);

    const nodeUuid = uuidv4();

    this._uuid = nodeUuid;
    this._name = name;
  }
}
