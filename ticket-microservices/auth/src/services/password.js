const bcrypt = require('bcryptjs');

exports.hash = async password => {
    return await bcrypt.hash(password, process.env.SALT);
}

exports.check = async (password, pwHash) => {
    return await bcrypt.compare(password, pwHash);
}