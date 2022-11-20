import { Property } from "./property";

describe("Property", () => {
  test("Create a new Property", () => {
    const newProperty = new Property("friend");

    expect(newProperty).toBeInstanceOf(Property);
    expect(newProperty.name).toBe("friend");
  });

  test("Changes a Property's name", () => {
    const newProperty = new Property("friend");

    newProperty.name = "neighbor";

    expect(newProperty.name).toBe("neighbor");
  });
});
