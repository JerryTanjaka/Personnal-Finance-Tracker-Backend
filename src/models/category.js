import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Category extends Model { };

export default (sequelize) => {
    Category.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            is_default: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('NOW()')
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: { model: 'users', key: 'id'}
            }
        },
        {
            sequelize,
            tableName: 'categories',
            modelName: 'Category',
            timestamps: true
        }
    )
}