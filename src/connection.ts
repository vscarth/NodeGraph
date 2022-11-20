import type { uuid } from "@/@types";
import { Weight } from "./weight";

interface IConnection {
  from: uuid;
  to: uuid;
  propertyName: string;
}

export class Connection extends Weight implements IConnection {
  private _from: uuid;
  private _to: uuid;
  private _propertyName: string;

  public get from(): uuid {
    return this._from;
  }

  public get to(): uuid {
    return this._to;
  }

  public get propertyName(): string {
    return this._propertyName;
  }

  constructor(from: uuid, to: uuid, propertyName: string, weight?: number) {
    super(weight);

    this._from = from;
    this._to = to;
    this._propertyName = propertyName;
  }
}
