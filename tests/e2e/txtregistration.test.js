const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../config/database');
const { User } = require('../../models');

describe('H2 - Fluxo de Cadastro de Usuário', () => {

  // Antes de cada teste, limpa a tabela de usuários
  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  // Teste de sucesso já coberto pelo teste de unidade, mas bom ter em E2E também
  it('H2C1-TC1: deve criar um novo usuário com sucesso', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        name: 'Usuario Valido',
        email: 'valido@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(302); // Redireciona após sucesso
    expect(response.headers.location).toBe('/');
  });

  it('H2C1-TC_EXTRA: deve retornar erro 400 se o e-mail já estiver em uso', async () => {
    // Primeiro, cria um usuário
    await User.create({
      name: 'Usuario Existente',
      email: 'existente@example.com',
      password: 'senha.forte'
    });

    // Tenta criar outro usuário com o mesmo e-mail
    const response = await request(app)
      .post('/user/register')
      .send({
        name: 'Outro Usuario',
        email: 'existente@example.com', // E-mail repetido
        password: 'outra.senha'
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toContain('Email já registrado.');
  });

  /*
    NOTA IMPORTANTE: Os testes abaixo (senha curta, nome inválido, etc.)
    irão FALHAR inicialmente. Isso ocorre porque a lógica de validação
    ainda não foi adicionada no `userController.js`.
    
    Vocês devem primeiro rodar o teste, vê-lo falhar, e então adicionar
    a validação no controller para que o teste passe.
    Isso é uma prática comum em desenvolvimento guiado por testes (TDD).
  */

  it('H2C1-TC_SENHA_CURTA: deve retornar erro ao tentar registrar com senha menor que 6 caracteres', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        name: 'Usuario Senha Curta',
        email: 'curta@example.com',
        password: '12345' // Senha com 5 caracteres
      });
    
    // Este teste espera que seu controller tenha uma validação para o tamanho da senha
    expect(response.statusCode).toBe(400); 
    // A mensagem de erro exata dependerá do que vocês definirem no controller
    // expect(response.text).toContain('A senha deve ter pelo menos 6 caracteres.');
  });
  
  // Adicione aqui outros testes de validação conforme o relatório, como nome muito curto ou e-mail inválido.

  afterAll(async () => {
    await sequelize.close();
  });
});