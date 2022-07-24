const { UserModel } = require("../schemas/user");

class User {
  static async create(newUser) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  static async findByEmail({ email }) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  static async findById({ id }) {
    const user = await UserModel.findOne({ id });
    return user;
  }

  static async findAll() {
    const users = await UserModel.find({});
    return users;
  }

  static async update({ user_email, fieldToUpdate, newValue }) {
    const filter = { email: user_email };
    const update = { [fieldToUpdate]: newValue };

    const updatedUser = await UserModel.findOneAndUpdate(filter, update);
    return updatedUser;
  }

  static delete = async ({ email }) => {
    const result = await UserModel.remove({ email });
    return result;
  };
}

export { User };
