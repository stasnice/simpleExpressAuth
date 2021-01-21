const products = require('../app/controller/products');
const auth = require('../app/controller/auth')
const authMiddleware = require('../app/middleware/auth')

module.exports = (app) => {
    /* products */
    app.get('/products', authMiddleware, products.getAll);
    app.post('/products', authMiddleware, products.create);
    app.put('/products/:id', authMiddleware, products.update);
    app.delete('/products/:id', authMiddleware, products.remove);
    /* auth */
    app.post('/signIn', auth.signIn);
    app.post('/signUp', auth.signUp);
    app.post('/refresh-tokens', auth.refreshTokens);
}