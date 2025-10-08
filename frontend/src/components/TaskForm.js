import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    difficulty: 'کم',
    status: 'باز',
    expertId: '',
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

  const { title, startDate, endDate, difficulty, status, expertId } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!expertId) {
      alert('لطفاً یک کارشناس انتخاب کنید.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/api/tasks', formData);
      console.log('Task created:', res.data);
      alert('وظیفه با موفقیت ثبت شد!');
      // Clear form
      setFormData({
        title: '',
        startDate: '',
        endDate: '',
        difficulty: 'کم',
        status: 'باز',
        expertId: '',
      });
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('خطا در ثبت وظیفه!');
    }
  };

  if (loading) {
    return <p>در حال بارگذاری کارشناسان...</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>ثبت وظیفه جدید</h2>
      <input
        type="text"
        placeholder="عنوان وظیفه"
        name="title"
        value={title}
        onChange={onChange}
        required
      />
      <input
        type="date"
        name="startDate"
        value={startDate}
        onChange={onChange}
        required
      />
      <input
        type="date"
        name="endDate"
        value={endDate}
        onChange={onChange}
        required
      />
      <select name="difficulty" value={difficulty} onChange={onChange}>
        <option value="کم">کم</option>
        <option value="متوسط">متوسط</option>
        <option value="زیاد">زیاد</option>
      </select>
      <select name="status" value={status} onChange={onChange}>
        <option value="باز">باز</option>
        <option value="در حال انجام">در حال انجام</option>
        <option value="انجام شده">انجام شده</option>
      </select>
      <select name="expertId" value={expertId} onChange={onChange} required>
        <option value="">-- انتخاب کارشناس --</option>
        {experts.map((expert) => (
          <option key={expert.id} value={expert.id}>
            {expert.fullName}
          </option>
        ))}
      </select>
      <button type="submit">ثبت وظیفه</button>
    </form>
  );
};

export default TaskForm;