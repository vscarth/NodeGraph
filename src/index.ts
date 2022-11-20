import { Graph } from "./graph";

const g = new Graph();

const n1 = g.addNode("alice");
const n2 = g.addNode("sarah");
const n3 = g.addNode("nick");
const c = g.addProperty("friends");
const f = g.addProperty("family");

g.addConnection(n1.uuid, n2.uuid, "friends");
g.addConnection(n1.uuid, n3.uuid, "friends");
g.addConnection(n1.uuid, n3.uuid, "family");

console.log(g.getAllConnections(n1.uuid));
console.log(g.getAllConnections(n1.uuid, "family"));
