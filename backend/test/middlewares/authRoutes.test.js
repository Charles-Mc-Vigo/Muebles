const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const authRoutes = require('../../middlewares/authRoutes');

jest.mock('jsonwebtoken');
jest.mock('../../models/userModel');

describe('authRoutes Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
		jest.clearAllMocks();
	});

  it('should return 401 if no token is provided', async () => {
    await authRoutes(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authorization required!" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the user is not found', async () => {
    req.cookies.authToken = 'validToken';
    jwt.verify.mockReturnValue({ _id: 'mockUserId' });
    User.findOne.mockResolvedValue(null);
  
    await authRoutes(req, res, next);
  
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found!" });
    expect(next).not.toHaveBeenCalled();
  });
  
  

  it('should return 401 if token verification fails', async () => {
    req.cookies.authToken = 'invalidToken';
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    await authRoutes(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized request denied!" });
    expect(next).not.toHaveBeenCalled();
  });

});
