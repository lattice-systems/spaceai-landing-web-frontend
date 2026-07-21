const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('mock/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

function toUserResponse(user) {
  const { password, ...userResponse } = user;
  return userResponse;
}

server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};
  const user = router.db.get('users').find({ email, password, isDeleted: false }).value();

  if (!user) {
    return res.status(401).jsonp({ message: 'Invalid credentials' });
  }

  const token = `mock.${user.id}.${Date.now()}`;
  res.jsonp({ token, user: toUserResponse(user) });
});

server.get('/api/auth/me', (req, res) => {
  const token = (req.headers.authorization ?? '').replace('Bearer ', '');
  const userId = token.split('.')[1];
  const user = router.db.get('users').find({ id: userId, isDeleted: false }).value();

  if (!user) {
    return res.status(401).jsonp({ message: 'Unauthorized' });
  }

  res.jsonp(toUserResponse(user));
});

server.get('/api/users', (req, res) => {
  const users = router.db.get('users').filter({ isDeleted: false }).value();
  res.jsonp(users.map(toUserResponse));
});

server.use('/api', router);

const port = 3000;
server.listen(port, () => console.log(`Mock API listening on http://localhost:${port}`));
