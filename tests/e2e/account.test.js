const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../config/database');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');

describe('H5 - Fluxo de Gerenciamento de Conta de Usuário', () => {
  let agent; //manter a sessão do usuário
  let testUser;

  // Antes de cada teste, cria um novo usuário e faz o login para obter a sessão
  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true }); // Limpa a tabela
    
    const hashedPassword = await bcrypt.hash('senha_original_123', 10);
    testUser = await User.create({
      name: 'Usuario Original',
      email: 'conta.teste@example.com',
      password: hashedPassword
    });

    agent = request.agent(app); //agente que armazena cookies

    //simula um usuário autenticado
    await agent
      .post('/user/login')
      .send({
        email: 'conta.teste@example.com',
        password: 'senha_original_123'
      });
  });
  
  // Cenário H5C1: Atualizar informações da conta
  it('H5C1: deve atualizar as informações do usuário logado', async () => {
    const response = await agent //agente autenticado
      .post('/user/edit')
      .send({
        name: 'Usuario Editado',
        email: 'conta.editada@example.com',
        password: 'nova_senha_456',
        confirmPassword: 'nova_senha_456'
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/user/dashboard');

    //verifica se os dados foram realmente atualizados no banco
    const updatedUser = await User.findByPk(testUser.id);
    expect(updatedUser.name).toBe('Usuario Editado');
    expect(updatedUser.email).toBe('conta.editada@example.com');

    //verifica se a nova senha foi salva corretamente
    const isPasswordMatch = await bcrypt.compare('nova_senha_456', updatedUser.password);
    expect(isPasswordMatch).toBe(true);
  });

  //Cenário H5C2: Deletar conta***
  it('H5C2: deve deletar a conta do usuário logado', async () => {
    const response = await agent // Usa o agente autenticado
      .post('/user/delete')
      .send(); // A rota de exclusão não precisa de corpo

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/'); // Redireciona para a home após deletar

    // Verifica se o usuário foi removido do banco de dados
    const deletedUser = await User.findByPk(testUser.id);
    expect(deletedUser).toBeNull();
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
