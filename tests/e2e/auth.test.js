const request = require('supertest');
const app = require('../../app'); // Certifique-se que o caminho para seu app.js está correto
const sequelize = require('../../config/database');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');

describe('H1 - Fluxo de Autenticação de Usuário', () => {

  // Antes de todos os testes, limpa o banco e cria um usuário para os testes de login
  beforeAll(async () => {
    //await sequelize.sync({ force: true });
    
    // Cria um usuário de teste no banco de dados
    const hashedPassword = await bcrypt.hash('12345678', 10);
    await User.create({
      name: 'Usuario Teste Login',
      email: 'login.teste@example.com',
      password: hashedPassword
    });
  });

  // Teste para o cenário de login com sucesso
  it('H1C1-TC1: deve autenticar com e-mail e senha válidos e redirecionar para /user/dashboard', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'login.teste@example.com',
        password: '12345678'
      });
    
    // Espera um redirecionamento (status 302) para a dashboard
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/user/dashboard');
  });

  // Teste para o cenário de senha incorreta
  it('H1C1-TC2: deve retornar erro 400 para senha incorreta', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'login.teste@example.com',
        password: 'senhaerrada'
      });

    // Espera um erro de "Bad Request" (status 400)
    expect(response.statusCode).toBe(400);
    // Verifica a mensagem de erro, conforme definido no userController.js
    expect(response.text).toContain('Senha incorreta.');
  });

  // Teste para o cenário de e-mail não cadastrado
  it('H1C1-TC3: deve retornar erro 400 para e-mail não cadastrado', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'naoexiste@example.com',
        password: 'qualquersenha'
      });

    // Espera um erro de "Bad Request" (status 400)
    expect(response.statusCode).toBe(400);
    // Verifica a mensagem de erro, conforme definido no userController.js
    expect(response.text).toContain('Usuário não encontrado.');
  });

  // Limpa o banco de dados após a execução dos testes
  afterAll(async () => {
    await sequelize.close();
  });
});
