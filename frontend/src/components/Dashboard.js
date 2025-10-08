import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeProjects: 0,
    openTasks: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/dashboard-stats');
        setStats(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        alert('خطا در دریافت آمار داشبورد!');
        setLoading(false);
      }
    };

    // Fetch stats every 30 seconds to keep it updated
    fetchStats();
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value }) => (
    <div className="stat-card">
      <h4>{title}</h4>
      <p className="stat-value">{value}</p>
    </div>
  );

  if (loading) {
    return <h2>در حال بارگذاری داشبورد...</h2>;
  }

  return (
    <div className="dashboard">
      <h2>داشبورد مدیریتی</h2>
      <div className="dashboard-cards">
        <StatCard title="پروژه‌های فعال" value={stats.activeProjects} />
        <StatCard title="وظایف باز" value={stats.openTasks} />
        <StatCard title="میانگین امتیاز عملکرد (ماه جاری)" value={stats.averageScore} />
      </div>
      <div className="dashboard-chart">
          <h3>نمودار پیشرفت پروژه‌ها</h3>
          <div className="chart-placeholder">
            <p>(نمودار در آینده در این بخش قرار خواهد گرفت)</p>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;