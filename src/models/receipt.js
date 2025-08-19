import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Receipt extends Model { }

export default (sequelize) => {
    Receipt.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: sequelize.literal('gen_random_uuid()'),
                primaryKey: true
            },
            file_path: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            create_date: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()'),
                allowNull: false
            }
        },
        {
            sequelize,
            tableName: 'receipts',
            modelName: 'Receipt',
            timestamps: false
        }
    );
    
    return Receipt
}