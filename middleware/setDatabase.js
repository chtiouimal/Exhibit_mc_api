const setDatabase = (dbConnection) => (req, res, next) => {
  req.db = dbConnection;
  next();
};

module.exports = setDatabase;