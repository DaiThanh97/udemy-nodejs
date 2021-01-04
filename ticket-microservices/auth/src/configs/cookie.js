const JwtCookie = {
    key: process.env.JWT_COOKIE_KEY,
    optionLogIn: {
        maxAge: process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== 'test'
    },
    optionLogOut: {
        maxAge: 0,
        secure: process.env.NODE_ENV !== 'test'
    }
}

module.exports = JwtCookie;