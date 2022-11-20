import { Node } from "./node";

describe("Node", () => {
  test("Create a new Node", () => {
    const newNode = new Node("Alice", undefined);

    expect(newNode).toBeInstanceOf(Node);
    expect(newNode.name).toBe("Alice");
    expect(newNode.weight).toBe(1);
    expect(newNode.uuid).toBe(newNode.uuid);
    expect(newNode.weightDeclared).toBe(false);
  });

  test("Create a new weighted Node", () => {
    const newNode = new Node("Alice", 0.001);

    expect(newNode).toBeInstanceOf(Node);
    expect(newNode.weight).not.toBe("0.001");
    expect(newNode.weight).toBe(0.001);
    expect(newNode.uuid).toBe(newNode.uuid);
    expect(newNode.weightDeclared).toBe(true);
  });

  test("Change node weight after creation", () => {
    const newNode = new Node("Alice", undefined);

    expect(newNode.weight).toBe(1);
    expect(newNode.weightDeclared).toBe(false);

    newNode.weight = -0.01;

    expect(newNode.weight).toBe(-0.01);
    expect(newNode.weightDeclared).toBe(true);
  });
});
