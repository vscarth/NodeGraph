interface IProperty {
  get name(): string;
  set name(v: string);
}

export class Property implements IProperty {
  private _name: string;

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }

  constructor(name: string) {
    this._name = name;
  }
}
