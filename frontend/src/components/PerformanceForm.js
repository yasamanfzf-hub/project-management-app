import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PerformanceForm = () => {
  const [formData, setFormData] = useState({
    expertId: '',
    month: '',
    creativity: 5,
    productivity: 5,
    speedAndAccuracy: 5,
    individualGrowth: 5,
    teamParticipation: 5,
    managerFeedback: '',
    expertResponse: '',
  });
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/experts');
        setExperts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching experts:', err);
        alert('خطا در دریافت لیست کارشناسان!');
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const {
    expertId,
    month,
    creativity,
    productivity,
    speedAndAccuracy,
    individualGrowth,
    teamParticipation,
    managerFeedback,
    expertResponse,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!expertId || !month) {
      alert('لطفاً کارشناس و ماه ارزیابی را انتخاب کنید.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/api/performance', formData);
      console.log('Performance evaluation created:', res.data);
      alert('فرم ارزیابی با موفقیت ثبت شد!');
      // Clear form
      setFormData({
        expertId: '',
        month: '',
        creativity: 5,
        productivity: 5,
        speedAndAccuracy: 5,
        individualGrowth: 5,
        teamParticipation: 5,
        managerFeedback: '',
        expertResponse: '',
      });
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('خطا در ثبت فرم ارزیابی!');
    }
  };

  if (loading) {
    return <p>در حال بارگذاری کارشناسان...</p>;
  }

  const renderRating = (name, value) => (
    <div>
      <label>{name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}</label>
      <input
        type="range"
        name={name}
        min="1"
        max="10"
        value={value}
        onChange={onChange}
      />
    </div>
  );

  return (
    <form onSubmit={onSubmit}>
      <h2>فرم ارزیابی عملکرد</h2>
      <select name="expertId" value={expertId} onChange={onChange} required>
        <option value="">-- انتخاب کارشناس --</option>
        {experts.map((expert) => (
          <option key={expert.id} value={expert.id}>
            {expert.fullName}
          </option>
        ))}
      </select>
      <input
        type="month"
        name="month"
        value={month}
        onChange={onChange}
        required
      />
      {renderRating("creativity", creativity)}
      {renderRating("productivity", productivity)}
      {renderRating("speedAndAccuracy", speedAndAccuracy)}
      {renderRating("individualGrowth", individualGrowth)}
      {renderRating("teamParticipation", teamParticipation)}
      <textarea
        placeholder="بازخورد مدیر"
        name="managerFeedback"
        value={managerFeedback}
        onChange={onChange}
      ></textarea>
      <textarea
        placeholder="پاسخ کارشناس"
        name="expertResponse"
        value={expertResponse}
        onChange={onChange}
      ></textarea>
      <button type="submit">ثبت ارزیابی</button>
    </form>
  );
};

export default PerformanceForm;