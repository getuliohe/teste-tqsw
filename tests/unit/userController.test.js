// tests/unit/userController.test.js

// Importe o objeto de handlers
const { handlers } = require('../../controllers/userController');
const { User } = require('../../models');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcryptjs');

jest.mock('../../models');
jest.mock('bcryptjs');

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/user/register',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
      session: {}
    });
    const res = httpMocks.createResponse();

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.create.mockResolvedValue({ id: 1, name: 'Test User' });

    // Chame o handler diretamente
    await handlers.postRegister(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(User.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    expect(req.session.user).toEqual({ id: 1, name: 'Test User' });
    expect(res.statusCode).toBe(302);
    expect(res._getRedirectUrl()).toBe('/');
  });
});
