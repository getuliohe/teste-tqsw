// Arquivo: tests/e2e/performance.test.js

const request = require('supertest');
const app = require('../../app'); // Caminho para seu app Express
const sequelize = require('../../config/database');

describe('Testes de Requisitos Não Funcionais - Desempenho', () => {

  it('RNF-01: A rota /courses/list deve responder em menos de 500ms', async () => {
    
    // Define o tempo máximo de resposta em milissegundos
    const TEMPO_MAXIMO_RESPOSTA = 500;

    // Mede o tempo de início
    const startTime = Date.now();

    // Faz a requisição para a rota que queremos testar
    await request(app)
      .get('/courses/list')
      .expect(200); // Primeiro, garante que a rota funciona (retorna status 200)

    // Mede o tempo de fim
    const endTime = Date.now();

    // Calcula a duração total da requisição
    const duration = endTime - startTime;

    // Imprime o tempo de resposta no console para podermos acompanhar
    console.log(`Tempo de resposta para /courses/list: ${duration}ms`);

    // A asserção do teste: verifica se a duração foi menor que o nosso requisito
    expect(duration).toBeLessThan(TEMPO_MAXIMO_RESPOSTA);
  });

  // Fecha a conexão com o banco após todos os testes deste arquivo
  afterAll(async () => {
    await sequelize.close();
  });
});
