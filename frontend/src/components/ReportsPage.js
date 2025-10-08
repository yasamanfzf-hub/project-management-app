import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('individual');
  const [filters, setFilters] = useState({
    expertId: '',
    projectId: '',
    month: '',
  });
  const [reportData, setReportData] = useState(null);
  const [experts, setExperts] = useState([]);
  const [projects, setProjects] = useState([]); // Assuming we'll have a way to get projects
  const [loading, setLoading] = useState(false);

  // Fetch initial data for filters (experts, projects)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const expertsRes = await axios.get('http://localhost:3001/api/experts');
        setExperts(expertsRes.data);
        // In a real app, you'd fetch projects too. For now, we'll leave it empty.
        // const projectsRes = await axios.get('http://localhost:3001/api/projects');
        // setProjects(projectsRes.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const generateReport = async () => {
    setLoading(true);
    setReportData(null);
    let params = { type: reportType };
    if (reportType === 'individual' && filters.expertId) {
      params.expertId = filters.expertId;
    } else if (reportType === 'project' && filters.projectId) {
      params.projectId = filters.projectId;
    } else if (reportType === 'monthly' && filters.month) {
      params.month = filters.month;
    }

    try {
      const res = await axios.get('http://localhost:3001/api/reports', { params });
      setReportData(res.data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('خطا در تهیه گزارش!');
    }
    setLoading(false);
  };

  const renderReport = () => {
    if (!reportData) return <p>برای مشاهده گزارش، نوع و فیلتر مورد نظر را انتخاب و دکمه "تهیه گزارش" را بزنید.</p>;

    // Simple JSON output for now. A real app would have nice components.
    return <pre>{JSON.stringify(reportData, null, 2)}</pre>;
  };

  return (
    <div>
      <h2>صفحه گزارش‌ها</h2>
      <div>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="individual">گزارش فردی</option>
          <option value="project">گزارش پروژه‌ای</option>
          <option value="monthly">گزارش ماهانه</option>
        </select>

        {reportType === 'individual' && (
          <select name="expertId" value={filters.expertId} onChange={handleFilterChange}>
            <option value="">-- انتخاب کارشناس --</option>
            {experts.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
          </select>
        )}

        {/* Placeholder for project filter */}
        {reportType === 'project' && (
           <p>فیلتر پروژه در آینده اضافه خواهد شد.</p>
        )}

        {reportType === 'monthly' && (
          <input type="month" name="month" value={filters.month} onChange={handleFilterChange} />
        )}

        <button onClick={generateReport} disabled={loading}>
          {loading ? 'در حال بارگذاری...' : 'تهیه گزارش'}
        </button>
      </div>

      <div className="report-content" style={{marginTop: '20px', backgroundColor: '#eee', padding: '10px', borderRadius: '5px'}}>
        <h3>نتایج گزارش</h3>
        {renderReport()}
      </div>
    </div>
  );
};

export default ReportsPage;