const JwtCookie = {
    key: process.env.JWT_COOKIE_KEY,
    optionLogIn: {
        maxAge: process.env.JWT_COOKIE_EXPIRE * 60 * 1000,
        secure: true
    },
    optionLogOut: {
        maxAge: 0,
        secure: true
    }
}

module.exports = JwtCookie;