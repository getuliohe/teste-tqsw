const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../config/database');

describe('Fluxo de Cursos', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it('deve criar um novo curso e redirecionar para a lista de cursos', async () => {
    const response = await request(app)
      .post('/courses/add')
      .send({
        name: 'Novo Curso de Teste',
        description: 'Descrição do novo curso'
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/courses/list');

    const course = await sequelize.models.Course.findOne({ where: { name: 'Novo Curso de Teste' } });
    expect(course).not.toBeNull();
    expect(course.description).toBe('Descrição do novo curso');
  });

});