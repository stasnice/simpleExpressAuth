module.exports = {
    appPORT: 3000,
    mongoUri: 'mongodb://localhost:27017/online-store',
    jwt: {
        secret: 'some secret string',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '2m',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '3m',
            }
        }
    }
}