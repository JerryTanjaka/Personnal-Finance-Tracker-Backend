/** @format */

import { DataTypes, Model } from "sequelize";

class Category extends Model {}

export default sequelize => {
	Category.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: sequelize.literal("gen_random_uuid()"),
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			is_default: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.literal("NOW()"),
			}
		},
		{
			sequelize,
			tableName: "categories",
			modelName: "Category",
			timestamps: false,
		},
	);

	return Category;
};
