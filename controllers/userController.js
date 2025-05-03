const { where } = require("sequelize");
const bcryptjs = require("bcryptjs");

const models = require("../models/index");
const saltLength = 8;

exports.index = async (req, res, next) => {
  // const users = await models.User.findAll();

  // const users = await models.User.findAll({
  //     attributes: ['id','name','email','created_at'],
  //     order: [['id','desc']]
  // });

  // const users = await models.User.findAll({
  //     attributes: {
  //         exclude: ['password']
  //     },
  //     where: {
  //         email: 'bb@bb.bb'
  //     },
  //     order: [
  //         ['id','desc']
  //     ]
  // });

  // const users = await models.User.findAll({
  //     attributes: [
  //         'id',
  //         'name',
  //         ['email','username'],
  //         'created_at'
  //     ],
  //     order: [['id','desc']]
  // });

  // const sql = 'SELECT `id`, `name`, `email` AS `username`, `created_at` FROM `users` AS `User` ORDER BY `User`.`id` DESC;'
  // const users = await models.sequelize.query(sql, {
  //     type: models.sequelize.QueryTypes.SELECT
  // });

  const users = await models.User.findAll({
    attributes: {
      exclude: ["password", "salt"],
    },
    include: [
      {
        model: models.Role,
        as: "role",
        attributes: ["id", "role"],
      },
    ],
  });

  res.status(200).json({
    message: "Users",
    data: users,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await models.User.findByPk(id, {
      attributes: [
        "id",
        "name",
        ["email", "username"],
        "role_id",
        "created_at",
      ],
      include: [
        {
          model: models.Role,
          as: "role",
          attributes: ["id", "role"],
        },
      ],
      order: [["id", "desc"]],
    });

    if (!user) {
      const error = new Error("This user was not found in the system.");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      message: "Show Users",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.params;

    console.log(email, password);

    // Check email duplicate
    const existEmail = await models.User.findOne({
      where: {
        email: email,
      },
    });
    if (!existEmail) {
      const error = new Error(
        "This user was not found in the system."
      );
      error.statusCode = 400;
      throw error;
    }

    const salt = existEmail['salt'];
    // hash password
    const passwordHash = await bcryptjs.hash(password, salt);


    const user = await models.User.findOne({
      attributes: ["id", "name", "email", "created_at", "updated_at"],
      include: [
        {
          model: models.Role,
          as: "role",
          attributes: ["id", "role"],
        },
      ],
      where: {
        email: email,
        password: passwordHash
      },
      // order: [["id", "desc"]],
    });

    if (!user) {
      const error = new Error("This user was not found in the system.");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      message: "Show Users",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role_id } = req.body;

    // Check email duplicate
    const existEmail = await models.User.findOne({
      where: {
        email: email,
      },
    });
    if (existEmail) {
      const error = new Error(
        "This user is already in the system. - middleware"
      );
      error.statusCode = 400;
      throw error;
    }

    // hash password
    const salt = await bcryptjs.genSalt(saltLength);
    const passwordHash = await bcryptjs.hash(password, salt);
    const isActive = "1";

    console.log({
      name: name,
      email: email,
      password: passwordHash,
      salt: salt,
      role_id: role_id,
      is_active: isActive,
      // created_at:,
      // updated_at:,
    });

    // insert
    const user = await models.User.create({
      name: name,
      email: email,
      password: passwordHash,
      salt: salt,
      role_id: role_id,
      is_active: isActive,
    });

    return res.status(201).json({
      message: "Insert Users success",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id, name, email, password } = req.body;

    if (req.params.id != id) {
      const error = new Error("Invalid user ID");
      error.statusCode = 400;
      throw error;
    }

    // // Check email duplicate
    // const existEmail = await models.User.findOne({
    //     where: {
    //         email: email
    //     }
    // });
    // if(existEmail){
    //     const error = new Error('This user is already in the system.');
    //     error.statusCode = 400;
    //     throw error;
    // }

    // hash password
    const salt = await bcryptjs.genSalt(saltLength);
    const passwordHash = await bcryptjs.hash(password, salt);

    // insert
    const user = await models.User.update(
      {
        name: name,
        email: email,
        password: passwordHash,
        salt: salt,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res.status(200).json({
      message: "Updated Users success",
      data: {
        id: id,
        email: email,
      },
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await models.User.findByPk(id);
    if (!user) {
      const error = new Error("This user was not found in the system.");
      error.statusCode = 404;
      throw error;
    }

    // delete user by id
    await models.User.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Deleted Users success",
      data: {
        id: id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};
