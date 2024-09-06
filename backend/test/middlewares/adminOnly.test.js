const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const adminOnly = require('../../middlewares/adminOnly');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../models/userModel');

describe('adminOnly Middleware', () => {
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
    await adminOnly(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No access token!" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token verification fails', async () => {
    req.cookies.adminToken = 'invalidToken';
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    await adminOnly(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized request denied!" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not an admin', async () => {
    req.cookies.adminToken = 'validToken';
    jwt.verify.mockReturnValue({ _id: 'mockUserId' });
    User.findOne.mockResolvedValueOnce({ _id: 'mockUserId', isAdmin: false });

    await adminOnly(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied. Admins only." });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 is it is not an admin', async () => {
    req.cookies.adminToken = 'validToken';
    jwt.verify.mockReturnValue({ _id: 'mockUserId' });
    User.findOne.mockResolvedValueOnce({ _id: 'mockUserId', isAdmin: false });

    await adminOnly(req, res, next);
    

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied. Admins only." });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 the admin is not verified', async () => {
    req.cookies.adminToken = 'validToken';
    jwt.verify.mockReturnValue({ _id: 'mockUserId' });
    User.findOne.mockResolvedValueOnce({ _id: 'mockUserId', isAdmin: true, isVerified: false });

    await adminOnly(req, res, next);
    

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Please verify your account first!" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if admin is verified', async()=>{
    req.cookies.adminToken = 'validToken';
    jwt.verify.mockReturnValue({ _id: 'mockUserId' });
    User.findOne.mockResolvedValueOnce({ _id: 'mockUserId', isAdmin: true , isVerified: true});

    await adminOnly(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  })
});
