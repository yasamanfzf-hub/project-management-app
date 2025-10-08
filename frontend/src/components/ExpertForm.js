import React, { useState } from 'react';
import axios from 'axios';

const ExpertForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    birthDate: '',
    email: '',
    phone: '',
  });

  const { fullName, position, birthDate, email, phone } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/experts', formData);
      console.log('Expert created:', res.data);
      alert('کارشناس با موفقیت ثبت شد!');
      // Clear form
      setFormData({
        fullName: '',
        position: '',
        birthDate: '',
        email: '',
        phone: '',
      });
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('خطا در ثبت کارشناس!');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>افزودن کارشناس جدید</h2>
      <div>
        <input
          type="text"
          placeholder="نام و نام خانوادگی"
          name="fullName"
          value={fullName}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="سمت"
          name="position"
          value={position}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <input
          type="date"
          placeholder="تاریخ تولد"
          name="birthDate"
          value={birthDate}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="ایمیل"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="شماره تماس"
          name="phone"
          value={phone}
          onChange={onChange}
          required
        />
      </div>
      <button type="submit">ثبت کارشناس</button>
    </form>
  );
};

export default ExpertForm;