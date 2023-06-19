module.exports = class APIQuery {
  constructor(model, queryObj, excludeFields) {
    this.model = model;
    this.queryObj = queryObj;
    this.excludeFields = excludeFields;
    this.query = null;
  }

  filter() {
    const queryObjswallow = { ...this.queryObj };
    this.excludeFields.forEach((field) => delete queryObjswallow[field]);
    // 替换为mango命令
    const queryObjStr = JSON.stringify(queryObjswallow).replace(
      /\b(lt|lte|gte|gt)\b/,
      (str) => `$${str}`
    );
    // filterQuery为空则return entire data

    this.query = this.model.find(JSON.parse(queryObjStr));
    return this;
  }

  select() {
    if (this.queryObj.field) {
      let fieldStr = this.queryObj.field.split('_');
      const schemaKey = Object.keys(this.model.schema.obj);
      fieldStr = fieldStr
        .filter((el) => schemaKey.indexOf(el) !== -1)
        .join(' ');
      if (fieldStr) {
        this.query.select(fieldStr);
      } else {
        this.query.find({ invalidinput: true });
      }
    } else {
      this.query.select('-__v -createdAt');
    }
    return this;
  }

  page() {
    if (this.queryObj.page) {
      const Page = this.queryObj.page * 1 || 1;
      const Limit = this.queryObj.limit * 1 || 3;

      this.query.limit(Limit).skip((Page - 1) * Limit);
    }
    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      // sort priority
      const sortSequence = this.queryObj.sort.split('_').join(' ');
      this.query.sort(sortSequence);
    } else {
      // 默认创建时间排序
      this.query.sort('-createdAt');
    }
    return this.query;
  }
};
