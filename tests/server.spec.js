const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
  it("Obteniendo un 200", async () => {
    const response = await request(server).get("/cafes").send();
    expect(response.statusCode).toBe(200);
  });

  it("El tipo de dato recibido ", async () => {
    const response = await request(server).get("/cafes").send();
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toBeInstanceOf(Object);
  });

  it("Obtiene un código 404 al intentar eliminar ID que no existe", async () => {
    const nonExistentId = 9999;
    const response = await request(server)
      .delete(`/cafes/${nonExistentId}`)
      .set("Authorization", "some-valid-token");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "No se encontró ningún cafe con ese id"
    );
  });

  it("Agrega un nuevo café y devuelve un código 201", async () => {
    const nuevoCafe = {
      id: 5,
      nombre: "Café Mocha",
      descripcion: "Un café con chocolate",
    };

    const response = await request(server).post("/cafes").send(nuevoCafe);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(4);
    expect(response.body).toContainEqual(expect.objectContaining(nuevoCafe));
  });

  it("Probando ruta Put devuelve un status code 400", async () => {
    const idParametro = 1;
    const cafeActualizado = {
      id: 2,
      nombre: "Café Americano Actualizado",
      descripcion: "Un café americano actualizado",
    };

    const response = await request(server)
      .put(`/cafes/${idParametro}`)
      .send(cafeActualizado);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "El id del parámetro no coincide con el id del café recibido"
    );
  });
});
