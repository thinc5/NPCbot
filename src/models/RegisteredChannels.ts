import { DataTypes, Sequelize } from "sequelize";

export function defineRegisteredChannels(connection: Sequelize): void {
  connection.define('RegisteredChannels', {
    channel_id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    paranoid: true
  });
}
