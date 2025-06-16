const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../config/database');
const { Student, Course } = require('../../models');

describe('H3 - Fluxo de Gerenciamento de Alunos', () => {
  let testCourse;

  // Antes de todos os testes, sincroniza o DB e cria um curso para associar aos alunos
  beforeAll(async () => {
    //await sequelize.sync({ force: true });
    testCourse = await Course.create({
      name: 'Curso de Teste para Alunos',
      description: 'Um curso para testar o CRUD de alunos.'
    });
  });

  // Limpa a tabela de alunos após cada teste para garantir a independência
  afterEach(async () => {
    await Student.destroy({ where: {}, truncate: true });
  });

  // Cenário H3C1: Adicionar novo aluno
  it('H3C1: deve adicionar um novo aluno com sucesso e redirecionar para a lista', async () => {
    const response = await request(app)
      .post('/student/add')
      .send({
        name: 'Aluno Novo',
        age: 20,
        email: 'aluno.novo@example.com',
        courseId: testCourse.id
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/student/list');

    // Verifica se o aluno foi realmente criado no banco de dados
    const newStudent = await Student.findOne({ where: { email: 'aluno.novo@example.com' } });
    expect(newStudent).not.toBeNull();
    expect(newStudent.name).toBe('Aluno Novo');
  });

  // Cenário H3C2: Editar aluno existente
  it('H3C2: deve editar um aluno existente e salvar as alterações', async () => {
    // Primeiro, cria um aluno para ser editado
    const student = await Student.create({
      name: 'Aluno Original',
      age: 22,
      email: 'aluno.original@example.com',
      courseId: testCourse.id
    });

    // Envia a requisição de edição
    const response = await request(app)
      .post(`/student/edit/${student.id}`)
      .send({
        name: 'Aluno Editado',
        age: 23,
        courseId: testCourse.id
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/student/list');

    // Verifica se as alterações foram salvas no banco
    const updatedStudent = await Student.findByPk(student.id);
    expect(updatedStudent.name).toBe('Aluno Editado');
    expect(updatedStudent.age).toBe(23);
  });

  // Cenário H3C3: Remover aluno
  it('H3C3: deve remover um aluno e redirecionar para a lista', async () => {
    // Cria um aluno para ser removido
    const studentToDelete = await Student.create({
      name: 'Aluno a Deletar',
      age: 25,
      email: 'aluno.delete@example.com',
      courseId: testCourse.id
    });

    // Envia a requisição para a rota de exclusão
    // O seu controller usa GET para exclusão, então o teste segue esse padrão
    const response = await request(app).get(`/student/delete/${studentToDelete.id}`);

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/student/list');

    // Verifica se o aluno foi removido do banco
    const deletedStudent = await Student.findByPk(studentToDelete.id);
    expect(deletedStudent).toBeNull();
  });
  
  afterAll(async () => {
    await sequelize.close();
  });
});
