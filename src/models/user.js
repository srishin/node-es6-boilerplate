module.exports = (sequelize, DataTypes) => {
    'use strict';
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            },
            allowNull: false
        },
        phone: {
            type: DataTypes.BIGINT
        },
        password: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.INTEGER
        },
        token: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        classMethods: {},
    });
};
