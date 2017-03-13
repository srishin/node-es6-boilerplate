module.exports = (sequelize, DataTypes) => {
    'use strict';
    return sequelize.define('transactions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM,
            values: ['DEBIT', 'CREDIT', 'LOAN']
        },
        amount: {
            type: DataTypes.FLOAT
        },
        towards: {
            type: DataTypes.STRING
        },
        purpose: {
            type: DataTypes.BIGINT
        },
        medium: {
            type: DataTypes.INTEGER
        },
        date: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.transactions.belongsTo(models.user);
            }
        },
    });
};
