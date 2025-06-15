const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../config/database');
const { Course, Student } = require('../../models');

describe('H4 - Fluxo de Gerenciamento de Cursos', () => {

  // Antes de tudo, sincroniza o banco de dados
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Limpa as tabelas após cada teste para evitar interferência
  afterEach(async () => {
    await Student.destroy({ where: {}, truncate: true });
    await Course.destroy({ where: {}, truncate: true });
  });

  // Cenário H4C1: Adicionar novo curso (teste que vocês já tinham)
  it('H4C1: deve criar um novo curso e redirecionar para a lista de cursos', async () => {
    const response = await request(app)
      .post('/courses/add')
      .send({
        name: 'Novo Curso de Teste',
        description: 'Descrição do novo curso'
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/courses/list');

    const course = await Course.findOne({ where: { name: 'Novo Curso de Teste' } });
    expect(course).not.toBeNull();
    expect(course.description).toBe('Descrição do novo curso');
  });

  // Cenário H4C2: Editar curso existente
  it('H4C2: deve editar um curso existente e salvar as alterações', async () => {
    // 1. Cria um curso para editar
    const course = await Course.create({ name: 'Curso Original', description: 'Descrição Original' });

    // 2. Envia a requisição de edição
    const response = await request(app)
      .post(`/courses/edit/${course.id}`)
      .send({
        name: 'Curso Editado',
        description: 'Descrição Editada'
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/courses/list');

    // 3. Verifica se a alteração foi salva no banco
    await course.reload(); // Recarrega os dados do curso do banco
    expect(course.name).toBe('Curso Editado');
    expect(course.description).toBe('Descrição Editada');
  });

  // Cenário H4C3: Remover curso
  it('H4C3: deve remover um curso e desassociar os alunos', async () => {
    // 1. Cria um curso e um aluno associado a ele
    const courseToDelete = await Course.create({ name: 'Curso a Deletar', description: 'Descrição' });
    const student = await Student.create({
      name: 'Aluno Associado',
      age: 21,
      email: 'aluno.associado@example.com',
      courseId: courseToDelete.id
    });

    // 2. Envia a requisição de exclusão
    const response = await request(app).get(`/courses/delete/${courseToDelete.id}`);

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/courses/list');

    // 3. Verifica se o curso foi removido do banco
    const deletedCourse = await Course.findByPk(courseToDelete.id);
    expect(deletedCourse).toBeNull();

    // 4. Verifica se o aluno foi desassociado (courseId virou null)
    await student.reload(); // Recarrega os dados do aluno do banco
    expect(student.courseId).toBeNull();
  });

  // Fecha a conexão com o banco após todos os testes
  afterAll(async () => {
    await sequelize.close();
  });
});