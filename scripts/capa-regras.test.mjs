import test from "node:test";
import assert from "node:assert";
import { validar } from "./capa-regras.mjs";
const s = (...f) => f.map((formato) => ({ formato }));
const hist = [{ slug: "v1", formatos: ["livre", "versus", "post"] }];

test("aceita 3 formatos novos com uma livre", () => assert.deepEqual(validar(s("cartaz", "livre", "grade"), hist, "v2"), []));
test("exige a capa livre", () => assert.match(validar(s("cartaz", "grade", "gigante"), [], "v2").join(), /livre/));
test("recusa formato recente", () => assert.match(validar(s("cartaz", "livre", "versus"), hist, "v2").join(), /últimos vídeos/));
test("recusa dois fundos iguais", () => assert.match(validar(s("cartaz", "livre", "grafico"), [], "v2").join(), /fundos diferentes/));
test("refazer o mesmo slug não conta contra si", () => assert.deepEqual(validar(s("versus", "livre", "post"), hist, "v1"), []));
