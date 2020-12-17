module.exports = (err, req, res, next) => {
    const { message } = err;
    res.status(err.status || 500).json({
        success: false,
        message,
    });
}