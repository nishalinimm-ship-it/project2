import Task from '../models/task.model.js';
import User from '../models/user.model.js';

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};

// Get single task by ID
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByPk(id, {
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task'
    });
  }
};

// Create new task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user is required'
      });
    }

    // Check if user exists
    const userExists = await User.findByPk(assignedTo);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user does not exist'
      });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
      assignedTo
    });

    const taskWithUser = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: taskWithUser
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // If assignedTo is being updated, check if user exists
    if (assignedTo) {
      const userExists = await User.findByPk(assignedTo);
      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user does not exist'
        });
      }
    }

    await task.update({
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      priority: priority || task.priority,
      status: status || task.status,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      assignedTo: assignedTo || task.assignedTo
    });

    const updatedTask = await Task.findByPk(id, {
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
};

// Update task status only
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: Pending, In Progress, or Completed'
      });
    }

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.update({ status });

    const updatedTask = await Task.findByPk(id, {
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
};