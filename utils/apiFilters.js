class APIFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr }

        // Remove fields from the query which will be used for sorting
        const removeFields = ['sort', 'fields', 'q', 'limit', 'page'];
        removeFields.forEach(el => delete queryStrCopy[el]);

        // Advanced filter
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-postingDate');
        }

        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    searchByQuery() {
        if (this.queryStr.q) {
            const qu = this.queryStr.q.split('').join(' ');
            this.query = this.query.find({ $text: { $search: "\"" + qu + "\"" } });
        }
        return this;
    }

    pagination() {
        // page limit skipresults
        const page = parseInt(this.queryStr.page, 10) || 1;
        const limit = parseInt(this.queryStr.limit, 10) || 10;
        const skipResults = (page - 1) * limit;

        // 
        this.query = this.query.skip(skipResults).limit(limit);

        return this;
    }
}

module.exports = APIFilters;