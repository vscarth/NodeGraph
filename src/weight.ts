const defaultWeight = 1;

interface IWeight {
  weight: number;
  weightDeclared: boolean;
}

export abstract class Weight implements IWeight {
  private _weight: number = defaultWeight;
  private _weightDeclared = false;

  public get weight(): number {
    return this._weight;
  }

  public set weight(v: number) {
    this._weight = v;
  }

  public get weightDeclared(): boolean {
    return this._weightDeclared;
  }

  private set weightDeclared(v: boolean) {
    this._weightDeclared = v;
  }

  constructor(weight: number | undefined) {
    if (weight != undefined) {
      this._weight = weight;
      this.weightDeclared = true;
    }
  }

  private weighted(): boolean {
    return this._weight == undefined;
  }
}
