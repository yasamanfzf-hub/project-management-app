import React, { useState } from 'react';
import axios from 'axios';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    floors: '',
    description: '',
  });

  const { name, area, floors, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/projects', formData);
      console.log('Project created:', res.data);
      alert('پروژه با موفقیت ثبت شد!');
      // Clear form
      setFormData({
        name: '',
        area: '',
        floors: '',
        description: '',
      });
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('خطا در ثبت پروژه!');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>ثبت پروژه جدید</h2>
      <div>
        <input
          type="text"
          placeholder="نام پروژه"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="متراژ"
          name="area"
          value={area}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="تعداد طبقات"
          name="floors"
          value={floors}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="توضیحات"
          name="description"
          value={description}
          onChange={onChange}
        ></textarea>
      </div>
      <button type="submit">ثبت پروژه</button>
    </form>
  );
};

export default ProjectForm;