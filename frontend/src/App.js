import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ProjectForm from './components/ProjectForm';
import ExpertForm from './components/ExpertForm';
import TaskForm from './components/TaskForm';
import PerformanceForm from './components/PerformanceForm';
import ReportsPage from './components/ReportsPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>سیستم مدیریت پروژه</h1>
      </header>
      <main>
        <div className="dashboard-section">
          <Dashboard />
        </div>
        <div className="form-section">
          <ProjectForm />
          <ExpertForm />
          <TaskForm />
          <PerformanceForm />
        </div>
        <div className="reports-section">
          <ReportsPage />
        </div>
      </main>
    </div>
  );
}

export default App;