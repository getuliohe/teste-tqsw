const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../config/database');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');

describe('Testes de Requisitos Não Funcionais - Desempenho', () => {

  //testar o login
  beforeAll(async () => {
    await User.destroy({ where: {}, truncate: true }); 
    const hashedPassword = await bcrypt.hash('senha_performance_123', 10);
    await User.create({
      name: 'Usuario Performance',
      email: 'performance@example.com',
      password: hashedPassword
    });
  });

  it('RNF-01: A rota de login deve responder em menos de 400ms', async () => {
    
    //login deve ser mais rápido
    const TEMPO_MAXIMO_RESPOSTA = 400;

    const startTime = Date.now();

    //requisição de login
    await request(app)
      .post('/user/login')
      .send({
        email: 'performance@example.com',
        password: 'senha_performance_123'
      })
      .expect(302); //espera um redirecionamento

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Tempo de resposta para /user/login: ${duration}ms`);

    //verifica se a duração foi menor que o requisito
    expect(duration).toBeLessThan(TEMPO_MAXIMO_RESPOSTA);
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
