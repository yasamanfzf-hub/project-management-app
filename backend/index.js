const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON database file
const DB_PATH = path.join(__dirname, 'db.json');

// Helper function to read from the database
const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    // Create the file with empty structure if it doesn't exist
    fs.writeFileSync(DB_PATH, JSON.stringify({ projects: [], experts: [], tasks: [], performances: [] }, null, 2));
  }
  const dbRaw = fs.readFileSync(DB_PATH);
  return JSON.parse(dbRaw);
};

// Helper function to write to the database
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// --- API Endpoints ---

// --- API Endpoints ---

// Endpoint to add a new project
app.post('/api/projects', (req, res) => {
  try {
    const db = readDB();
    const newProject = {
      id: Date.now(), // Simple unique ID
      ...req.body,
    };
    db.projects.push(newProject);
    writeDB(db);
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving project' });
  }
});

// Endpoint to add a new expert
app.post('/api/experts', (req, res) => {
  try {
    const db = readDB();
    const newExpert = {
      id: Date.now(),
      ...req.body,
    };
    db.experts.push(newExpert);
    writeDB(db);
    res.status(201).json(newExpert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving expert' });
  }
});

// Endpoint to get all experts
app.get('/api/experts', (req, res) => {
  try {
    const db = readDB();
    res.status(200).json(db.experts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching experts' });
  }
});

// Endpoint to add a new task
app.post('/api/tasks', (req, res) => {
  try {
    const db = readDB();
    const newTask = {
      id: Date.now(),
      ...req.body,
    };
    db.tasks.push(newTask);
    writeDB(db);
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving task' });
  }
});

// Endpoint to add a new performance evaluation
app.post('/api/performance', (req, res) => {
  try {
    const db = readDB();
    const newPerformance = {
      id: Date.now(),
      ...req.body,
    };
    db.performances.push(newPerformance);
    writeDB(db);
    res.status(201).json(newPerformance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving performance evaluation' });
  }
});

// Endpoint for generating reports
app.get('/api/reports', (req, res) => {
  try {
    const db = readDB();
    const { type, expertId, projectId, month } = req.query;

    let reportData = {};

    switch (type) {
      case 'individual':
        if (!expertId) return res.status(400).json({ message: 'Expert ID is required for individual report' });
        const id = parseInt(expertId);
        reportData.expert = db.experts.find(e => e.id === id) || null;
        reportData.tasks = db.tasks.filter(t => t.expertId == id);
        reportData.performance = db.performances.filter(p => p.expertId == id);
        break;

      case 'project':
         if (!projectId) return res.status(400).json({ message: 'Project ID is required for project report' });
         // This is a simplified version. A real app might link tasks to projects.
         // For now, we just return project details.
         reportData.project = db.projects.find(p => p.id == projectId) || null;
         reportData.tasks = db.tasks; // simplified: returning all tasks
        break;

      case 'monthly':
        if (!month) return res.status(400).json({ message: 'Month is required for monthly report' });
        // Assuming month is in 'YYYY-MM' format
        reportData.tasks = db.tasks.filter(t => t.startDate && t.startDate.startsWith(month));
        reportData.performances = db.performances.filter(p => p.month === month);
        break;

      default:
        return res.status(400).json({ message: 'Invalid report type specified' });
    }

    res.status(200).json(reportData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

// Endpoint for dashboard statistics
app.get('/api/dashboard-stats', (req, res) => {
  try {
    const db = readDB();

    // 1. Active Projects Count
    const activeProjects = db.projects.length;

    // 2. Open Tasks Count
    const openTasks = db.tasks.filter(t => t.status === 'باز').length;

    // 3. Average performance score for the current month
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const currentMonthPerformances = db.performances.filter(p => p.month === currentMonth);

    let averageScore = 0;
    if (currentMonthPerformances.length > 0) {
      const totalScore = currentMonthPerformances.reduce((acc, p) => {
        return acc +
               parseInt(p.creativity) +
               parseInt(p.productivity) +
               parseInt(p.speedAndAccuracy) +
               parseInt(p.individualGrowth) +
               parseInt(p.teamParticipation);
      }, 0);
      const totalMetrics = currentMonthPerformances.length * 5; // 5 metrics per performance
      averageScore = (totalScore / totalMetrics).toFixed(2);
    }

    res.status(200).json({
      activeProjects,
      openTasks,
      averageScore: parseFloat(averageScore),
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Placeholder for other endpoints
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // Initialize DB file on start
  readDB();
});