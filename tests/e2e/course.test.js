const request = require('supertest');
const app = require('../../app'); // Exporte seu app Express em app.js
const sequelize = require('../../config/database');

describe('Fluxo de Cursos', () => {
  beforeAll(async () => {
    // Limpar e popular o banco de dados de teste antes dos testes
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

    // Opcional: Verificar se o curso foi realmente inserido no banco de dados
    const course = await sequelize.models.Course.findOne({ where: { name: 'Novo Curso de Teste' } });
    expect(course).not.toBeNull();
    expect(course.description).toBe('Descrição do novo curso');
  });

});