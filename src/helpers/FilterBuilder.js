function FilterBuilder(filters) {
  if (!this) {
    return new FilterBuilder(filters);
  }

  this.filters = filters ? filters : [];

  const self = this;

  this.eq = function(field, value) {
    self.filters.push(field + ".eq('" + value + "')");
    return self;
  };

  this.gt = function(field, value) {
    self.filters.push(field + ".gt('" + value + "')");
    return self;
  };

  this.gteq = function(field, value) {
    self.filters.push(field + ".gteq('" + value + "')");
    return self;
  };

  this.lt = function(field, value) {
    self.filters.push(field + ".lt('" + value + "')");
    return self;
  };

  this.lteq = function(field, value) {
    self.filters.push(field + ".lteq('" + value + "')");
    return self;
  };

  this.bt = function(field, valueOne, valueTwo) {
    self.filters.push(field + ".bt('" + valueOne + "','" + valueTwo + "')");
    return self;
  };

  this.toString = function() {
    return self.filters.join(",");
  };

  this.getFilter = function() {
    return "filter=" + self.filters.join(",");
  };

  this.setFilter = function(filters) {
    self.filters = filters;
    return self;
  };

  return this;
}

module.exports = FilterBuilder;
