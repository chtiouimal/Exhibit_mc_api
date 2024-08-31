const withModel = (models) => (req, res, next) => {
  req.models = {}; // Initialize an empty object to store models

  Object.keys(models).forEach((key) => {
    req.models[key] = req.db.model(key, models[key]);
  });

  next();
};


module.exports = withModel;