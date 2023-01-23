'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcrypt"); 
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt)

module.exports = (sequelize, DataTypes) => {
  class resto_profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.resto_product, {foreignKey:"id"})
    }
    static #encrypt = () => bcrypt.hashSync(myPlaintextPassword, salt)

    static register = ({username, password, address}) => {
      const encryptedPassword =this.#encrypt(password)
      return this.create({username, password:encryptedPassword, address, membership: true, isSuperAdmin: false})
    }

  // checkPassword = password => bcrypt.compareSync(password, this.password)
  checkPassword = password => bcrypt.compareSync(myPlaintextPassword, hash); // true

    static authenticate = async ({username, password}) => {
      try {
        const user = await this.findOne({where: { username }})
        if(!user) return Promise.reject("user not found")

        const isPasswordValid = user.checkPassword(password)
        if(!isPasswordValid) return Promise.reject("wrong password")

        return Promise.resolve(user)

      } catch (error) {
        return Promise.reject(error)
      }
  }
}
  resto_profile.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    membership: DataTypes.BOOLEAN,
    isSuperAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'resto_profile',
  });
  return resto_profile;
};