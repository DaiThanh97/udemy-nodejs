const advancedResults = (model, populate) => async (req, res, next) => {
    let { select, sort, limit, page, ...reqQuery } = req.query;
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, x => `$${x}`);

    // Not execute YET
    let query = model.find(JSON.parse(queryStr));

    if (select) {
        select = select.replace(/,/g, ' ');
        query = query.select(select);
    }

    if (sort) {
        sort = sort.replace(/,/g, ' ');
        query = query.sort(sort);
    }
    else {
        query = query.sort('-createdAt');
    }

    // Pagination
    page = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 20;
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = page * itemsPerPage;
    const total = await model.countDocuments();
    query = query.skip(startIndex).limit(itemsPerPage);

    if (populate) {
        query = query.populate(populate);
    }

    // Execute the Query
    const results = await query.lean();

    // Pagination result
    const pagination = {};
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            itemsPerPage
        }
    }
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            itemsPerPage
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
}

module.exports = advancedResults;