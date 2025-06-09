const userController = require('../../controllers/userController');
const { User } = require('../../models');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcryptjs');

// Mock do modelo User
jest.mock('../../models');
// Mock do bcrypt
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

    await userController.post('/register')(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(User.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    expect(req.session.user).toEqual({ id: 1, name: 'Test User' });
    expect(res.statusCode).toBe(302); // Redirect
    expect(res._getRedirectUrl()).toBe('/');
  });

});