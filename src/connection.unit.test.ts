import { Connection } from "./connection";

describe("Connection", () => {
  test("Create a new connection", () => {
    const newConnection = new Connection("a", "b", "friend");

    expect(newConnection).toBeInstanceOf(Connection);
    expect(newConnection.from).toBe("a");
    expect(newConnection.to).toBe("b");
    expect(newConnection.propertyName).toBe("friend");
  });
});
