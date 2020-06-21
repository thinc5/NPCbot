
import { DataTypes, Sequelize } from "sequelize";

export function defineTrends(connection: Sequelize): void {
  connection.define('Trends', {
    tweet_id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false
    },
    hashtag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    paranoid: false
  });
}
