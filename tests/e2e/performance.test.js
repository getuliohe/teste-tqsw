// Arquivo: tests/e2e/performance.test.js
// Versão alternativa focando na rota de login

const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../config/database');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');

describe('Testes de Requisitos Não Funcionais - Desempenho', () => {

  // Antes dos testes, cria um usuário para podermos testar o login
  beforeAll(async () => {
    await User.destroy({ where: {}, truncate: true }); // Limpa a tabela
    const hashedPassword = await bcrypt.hash('senha_performance_123', 10);
    await User.create({
      name: 'Usuario Performance',
      email: 'performance@example.com',
      password: hashedPassword
    });
  });

  it('RNF-01: A rota de login deve responder em menos de 400ms', async () => {
    
    // O tempo para login deve ser ainda mais rápido
    const TEMPO_MAXIMO_RESPOSTA = 400;

    const startTime = Date.now();

    // Faz a requisição de login
    await request(app)
      .post('/user/login')
      .send({
        email: 'performance@example.com',
        password: 'senha_performance_123'
      })
      .expect(302); // Espera um redirecionamento, que é o comportamento de sucesso

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Tempo de resposta para /user/login: ${duration}ms`);

    // Verifica se a duração foi menor que o nosso requisito
    expect(duration).toBeLessThan(TEMPO_MAXIMO_RESPOSTA);
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
