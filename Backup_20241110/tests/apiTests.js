const request = require('supertest');
const app = require('../index.js'); // Asegúrate de que apunta al archivo de tu servidor Express

describe('API Tests', () => {
  // Prueba para obtener todas las publicaciones
  it('GET /api/posts - Debe devolver todas las publicaciones', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Prueba para obtener una publicación por ID
  it('GET /api/posts/:id - Debe devolver una publicación específica por ID', async () => {
    const postId = 1; // ID de ejemplo
    const res = await request(app).get(`/api/posts/${postId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', postId);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('content');
  });

  // Prueba para crear una nueva publicación
  it('POST /api/posts - Debe crear una nueva publicación', async () => {
    const newPost = {
      title: 'Nueva publicación de prueba',
      content: 'Este es el contenido de la publicación de prueba.',
      author: 'Test Author',
      category: 'Pruebas',
      date: '2024-10-11'
    };

    const res = await request(app)
      .post('/api/posts')
      .send(newPost);

    expect(res.statusCode).toEqual(201); // Código de estado para creación exitosa
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual(newPost.title);
    expect(res.body.content).toEqual(newPost.content);
  });

  // Prueba para actualizar una publicación existente
  it('PUT /api/posts/:id - Debe actualizar una publicación existente', async () => {
    const postId = 1; // ID de ejemplo
    const updatedPost = {
      title: 'Título actualizado',
      content: 'Contenido actualizado'
    };

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .send(updatedPost);

    expect(res.statusCode).toEqual(200); // Código de estado para actualización exitosa
    expect(res.body.title).toEqual(updatedPost.title);
    expect(res.body.content).toEqual(updatedPost.content);
  });

  // Prueba para eliminar una publicación
  it('DELETE /api/posts/:id - Debe eliminar una publicación existente', async () => {
    const postId = 1; // ID de ejemplo

    const res = await request(app).delete(`/api/posts/${postId}`);
    expect(res.statusCode).toEqual(200); // Código de estado para eliminación exitosa
    expect(res.body).toHaveProperty('message', 'Publicación eliminada con éxito');
  });

  // Pruebas de usuario
  it('GET /api/users - Debe devolver todos los usuarios', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('POST /api/users - Debe crear un nuevo usuario', async () => {
    const newUser = {
      username: 'testUser',
      email: 'test@example.com',
      password: 'testPassword'
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toEqual(newUser.username);
  });
});
