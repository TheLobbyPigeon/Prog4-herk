const logger = require('../util/logger');
const bcrypt = require('bcrypt');
const db = require('../dao/mysql-db');


const userServices = {
    encryptPassword: async (password) => {
        return await bcrypt.hash(password.trim(), 10);
    },

    getAllUsers: async () => {
        try {
            const users = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM `user`', (err, results) => {
                    if (err) {
                        return reject(`Error executing query: ${err}`);
                    }
                    resolve(results);
                });
            });
            return users;
        } catch (error) {
            logger.error(`Error in userServices.getAllUsers: ${error}`);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const user = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM `user` WHERE UserId = ?', [id], (err, results) => {
                    if (err) {
                        return reject(`Error executing query: ${err}`);
                    }
                    resolve(results[0]);
                });
            });
            return user;
        } catch (error) {
            logger.error(`Error in userServices.getUserById: ${error}`);
            throw error;
        }
    },

    changeDataById: async (userId, updatedUserData) => {
        try {
            //Check required fields
            if (!updatedUserData || !updatedUserData.Password) {
                throw new Error('Password field is missing in updated data');
            }

            //Encrypt password
            updatedUserData.Password = await userServices.encryptPassword(updatedUserData.Password);

            //Update user data
            const user = await new Promise((resolve, reject) => {
                db.query('UPDATE user SET ? WHERE UserId = ?', [updatedUserData, userId], (err, results) => {
                    if (err) {
                        return reject(`Error executing query: ${err}`);
                    }
                    if (results.affectedRows === 0) {
                        return reject(`User with id ${userId} not found`);
                    }

                    //Get updated user data
                    db.query('SELECT * FROM user WHERE UserId = ?', [userId], (err, results2) => {
                        if (err) {
                            return reject(`Error executing query: ${err}`);
                        }
                        resolve(results2);
                    });

                });
            })
            return user;
        } catch (error) {
            logger.error(`Error in userServices.changeDataById: ${error}`);
            throw error;
        }
    },

    getUserByEmail: async (email) => {
        try {
            const user = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM `user` WHERE Email = ?', [email], (err, results) => {
                    if (err) {
                        return reject(`Error executing query: ${err}`);
                    }
                    resolve(results[0]);
                });
            });
            return user;
        } catch (error) {
            logger.error(`Error in userServices.getUserByEmail: ${error}`);
            throw error;
        }
    },

    addUser: async (newUserData) => {
        try {
            // Check required fields
            if (!newUserData || !newUserData.FamilyId || !newUserData.Role || !newUserData.Name || !newUserData.Email || !newUserData.Password) {
                throw new Error('Required fields are missing in new user data');
            }

            // Encrypt password
            newUserData.Password = await userServices.encryptPassword(newUserData.Password);

            const user = await new Promise((resolve, reject) => {
                db.query('INSERT INTO `user` SET ?', newUserData, (err, results) => {
                    if (err) {
                        return reject(`Error executing query: ${err}`);
                    }

                    // Get new user data
                    db.query('SELECT * FROM `user` WHERE UserId = ?', [results.insertId], (err, results2) => {
                        if (err) {
                            return reject(`Error executing query: ${err}`);
                        }
                        resolve(results2[0]);
                    });
                });
            });
            return user;
        } catch (error) {
            logger.error(`Error in userServices.addUser: ${error}`);
            throw error;
        }
    }
};

module.exports = userServices;