import log from "loglevel";

import { uuid } from "./@types";

type nameType = string | number | object;

export function getByName<T>(name: nameType, mapByName: T): uuid | undefined {
  if (mapByName instanceof Map) {
    try {
      return mapByName.get(name);
    } catch (e) {
      console.error(e);
      return;
    }
  }

  return;
}

interface ICreateNewEntry<K, N, V> {
  uuid: K;
  name: N;
  value: V;
}

export class MapWithReferenceByName<N, K, V> {
  private _map: Map<K, V> = new Map<K, V>();
  private _mapKeyByName: Map<N, K> = new Map<N, K>();

  public get map(): Map<K, V> {
    return this._map;
  }

  setEntry({ name, uuid, value }: ICreateNewEntry<K, N, V>): void {
    this._map.set(uuid, value);
    this._mapKeyByName.set(name, uuid);
  }

  deleteEntry(name: N): void {
    const uuid = this._mapKeyByName.get(name);

    if (uuid) this._map.delete(uuid);
    this._mapKeyByName.delete(name);
  }

  clearEntries(): void {
    this._map.clear();
    this._mapKeyByName.clear();
  }

  getEntryByName(name: N): V | undefined {
    const uuid = this._mapKeyByName.get(name);

    if (uuid) return this._map.get(uuid);
  }

  getEntryByUuid(uuid: K): V | undefined {
    return this._map.get(uuid);
  }
}

type errorParams = {
  checkAgainst: unknown;
  text: string;
};

type LogVerbosity = "trace" | "debug" | "info" | "warn" | "error";

export function checkIfExist(
  verbosity: LogVerbosity,
  args: errorParams[],
  endText?: string
): boolean {
  let errorMessage = "";

  let error = false;

  // eslint-disable-next-line prefer-const
  for (let arg of args) {
    if (arg.checkAgainst == undefined) {
      error = true;

      errorMessage += errorMessage ? "and" : "";
      errorMessage += ` ${arg.text} `;
    }
  }

  errorMessage += endText;

  if (error) {
    switch (verbosity) {
      case "trace":
        log.trace(errorMessage);
        break;
      case "debug":
        log.debug(errorMessage);
        break;
      case "info":
        log.info(errorMessage);
        break;
      case "warn":
        log.warn(errorMessage);
        break;
      case "error":
        log.error(errorMessage);
        break;
    }
  }
  return error;
}
