import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js';

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      allowNull: false,
      defaultValue: 'Medium'
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date'
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'assigned_to',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
    underscored: true
  }
);

// Define relationships
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });
User.hasMany(Task, { foreignKey: 'assignedTo' });

export default Task;