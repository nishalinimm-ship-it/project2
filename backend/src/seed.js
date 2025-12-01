import sequelize from './config/db.js';
import User from './models/user.model.js';
import Task from './models/task.model.js';

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');
    
    // Reset database
    await sequelize.sync({ force: true });
    console.log('Database reset complete');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123'
    });

    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123'
    });

    console.log('✅ Users created successfully');

    // Create sample tasks
    await Task.create({
      title: 'Setup Project',
      description: 'Initialize the project with all dependencies',
      priority: 'High',
      status: 'Completed',
      assignedTo: admin.id,
      dueDate: new Date('2024-12-05')
    });

    await Task.create({
      title: 'Design Database Schema',
      description: 'Create tables for users and tasks',
      priority: 'High',
      status: 'Completed',
      assignedTo: admin.id,
      dueDate: new Date('2024-12-06')
    });

    await Task.create({
      title: 'Build Login API',
      description: 'Create authentication endpoint with JWT',
      priority: 'Medium',
      status: 'In Progress',
      assignedTo: user.id,
      dueDate: new Date('2024-12-10')
    });

    await Task.create({
      title: 'Create Task Management UI',
      description: 'Build Angular components for task management',
      priority: 'Medium',
      status: 'Pending',
      assignedTo: user.id,
      dueDate: new Date('2024-12-15')
    });

    await Task.create({
      title: 'Write Unit Tests',
      description: 'Add comprehensive unit and integration tests',
      priority: 'Low',
      status: 'Pending',
      assignedTo: admin.id,
      dueDate: new Date('2024-12-20')
    });

    await Task.create({
      title: 'Deploy to Production',
      description: 'Deploy application to production server',
      priority: 'High',
      status: 'Pending',
      assignedTo: admin.id,
      dueDate: new Date('2024-12-25')
    });

    console.log('Sample tasks created successfully');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin: admin@example.com / admin123');
    console.log('User:  user@example.com / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
