const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../config/database');

describe('Testes de Requisitos Não Funcionais - Segurança', () => {

  it('RNF-03: Não deve permitir login com tentativa de SQL Injection no email', async () => {
    //string clássica que tenta burlar uma query SQL mal feita
    const sqlInjectionAttempt = "' OR '1'='1";

    const response = await request(app)
      .post('/user/login')
      .send({
        email: sqlInjectionAttempt,
        password: 'qualquercoisa'
      });

    //o teste PASSA se a aplicação se comportar como esperado:
    //NÃO redireciona para o dashboard (isso seria um SUCESSO do ataque)
    expect(response.headers.location).not.toBe('/user/dashboard');

    //retorna um erro de "Usuário não encontrado", pois o Sequelize trata a string de ataque como um email literal e não encontra no banco.  
    expect(response.statusCode).toBe(400);
    expect(response.text).toContain('Usuário não encontrado.');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
