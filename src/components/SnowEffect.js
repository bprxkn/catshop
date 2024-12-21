import React, { useEffect } from 'react';
import '../styles/snow.css'; // เชื่อมโยงกับไฟล์ CSS

const SnowEffect = () => {
  useEffect(() => {
    const snowContainer = document.querySelector('.snow-container');

    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.textContent = '❄'; // ตัวหิมะ
      snowflake.style.left = `${Math.random() * 100}vw`; // ตำแหน่งสุ่มในแนวนอน
      snowflake.style.fontSize = `${Math.random() * 10 + 10}px`; // ขนาดสุ่ม
      snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // ความเร็วสุ่ม

      snowContainer.appendChild(snowflake);

      // ลบหิมะที่ตกถึงพื้นหลังจาก 10 วินาที
      setTimeout(() => snowflake.remove(), 10000);
    };

    // สร้างหิมะทุก 200ms
    const interval = setInterval(createSnowflake, 200);

    return () => clearInterval(interval); // ล้าง interval เมื่อ Component ถูก unmount
  }, []);

  return <div className="snow-container"></div>;
};

export default SnowEffect;
