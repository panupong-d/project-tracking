const models = require("../models/index");

exports.index = async (req, res, next) => {
  res.status(200).json({
    message: "Blogs",
    data: {
      name: "name",
    },
  });
};
