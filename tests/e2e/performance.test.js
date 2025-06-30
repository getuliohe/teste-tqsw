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

  
  it('RNF-02: Deve lidar com 10 requisições de login concorrentes sem erros', async () => {
    const NUMERO_DE_REQUISICOES = 10;
    const TEMPO_MAXIMO_TOTAL = 1500; //tempo máximo para todas as 10 requisições terminarem
  
    const loginRequest = () => 
      request(app)
        .post('/user/login')
        .send({
          email: 'performance@example.com',
          password: 'senha_performance_123'
        });
  
    //array de requisição de login
    const requests = Array(NUMERO_DE_REQUISICOES).fill(null).map(() => loginRequest());
  
    const startTime = Date.now();
  
    //dispara as requisições em paralelo e espera todas terminarem
    const responses = await Promise.all(requests);
  
    const duration = Date.now() - startTime;
  
    console.log(`Tempo total para ${NUMERO_DE_REQUISICOES} logins concorrentes: ${duration}ms`);
  
    //verifica se o tempo total está dentro do limite
    expect(duration).toBeLessThan(TEMPO_MAXIMO_TOTAL);
  
    //verifica se TODAS as requisições foram bem-sucedidas (receberam redirect 302)
    for (const response of responses) {
      expect(response.statusCode).toBe(302);
    }
  });
  
  afterAll(async () => {
    await sequelize.close();
  });
});
