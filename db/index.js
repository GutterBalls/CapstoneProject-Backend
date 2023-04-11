module.exports = {
    ...require('./users'), 
    ...require('./products'),
    ...require('./orders'),
    ...require('./payment'),
    ...require('./cartItems')
};