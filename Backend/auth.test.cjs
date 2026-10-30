const { test } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginmodel } = require('./db');
const { Login, Signup, Authmiddleware } = require('./Auth');

test('authentication handlers validate credentials and issue usable tokens', async () => {
  const originalFind = loginmodel.findOne;
  const originalCreate = loginmodel.create;
  const originalSecret = process.env.secret;
  process.env.secret = 'test-only-signing-secret';
  const response = () => ({ code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
  try {
    const password = await bcrypt.hash('correct-password', 10);
    loginmodel.findOne = async () => ({ name: 'tester', password });
    let res = response();
    await Login({ body: { name: 'tester', password: 'wrong-password' } }, res);
    assert.equal(res.code, 401);
    assert.equal(res.body.token, undefined);
    res = response();
    await Login({ body: { name: 'tester', password: 'correct-password' } }, res);
    assert.equal(jwt.verify(res.body.token, process.env.secret).name, 'tester');
    res = response();
    await Signup({ body: { name: 'tester', password: 'correct-password' } }, res);
    assert.equal(res.code, 409);
    loginmodel.findOne = async () => null;
    let created;
    loginmodel.create = async value => { created = value; };
    res = response();
    await Signup({ body: { name: 'new-user', password: 'new-password' } }, res);
    assert.equal(res.code, 201);
    assert.equal(jwt.verify(res.body.token, process.env.secret).name, 'new-user');
    assert.equal(await bcrypt.compare('new-password', created.password), true);
    for (const body of [undefined, {}, { name: {}, password: 'pass' }, { name: '    ', password: 'pass' }]) {
      res = response();
      Authmiddleware({ body }, res, () => assert.fail('Invalid credentials accepted'));
      assert.equal(res.code, 400);
    }
  } finally {
    loginmodel.findOne = originalFind;
    loginmodel.create = originalCreate;
    if (originalSecret === undefined) delete process.env.secret;
    else process.env.secret = originalSecret;
  }
});
