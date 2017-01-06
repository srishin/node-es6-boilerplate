module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
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
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        classMethods: {
        },
    });
};
