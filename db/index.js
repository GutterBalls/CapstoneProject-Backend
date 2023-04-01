module.exports = {
    // ...require('./client'), // 
    ...require('./users'), // adds key/values from users.js
    ...require('./products'),
    ...require('./orders'),
    ...require('./itemsPurchased')
};