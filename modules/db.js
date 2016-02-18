exports.queryDatabase = function(query, values) {
  if (process.env.NODE_ENV !== 'production') {
    return new Promise(function(resolve, reject) {
      resolve("Database access");
    });
  } else {
    return db.query(query, values);
  }
}
