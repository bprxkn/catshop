import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/main.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const CatList = () => {
  const navigate = useNavigate(); // เรียก useNavigate ภายใน React Function Component

  const [cats, setCats] = useState([]);
  const [newCat, setNewCat] = useState({
    name: '',
    breed: '',
    age: '',
    price: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ฟังก์ชัน Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // นำทางไปยังหน้า Login หลังจาก Logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // ฟังก์ชันดึงข้อมูลแมวทั้งหมด
  const fetchCats = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'cats'));
      const catsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCats(catsData);
    } catch (error) {
      console.error('Error fetching cats:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  // ฟังก์ชันเพิ่มข้อมูลแมวใหม่
  const handleAddCat = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'cats'), newCat);
      setCats([...cats, { ...newCat, id: docRef.id }]);
      setNewCat({
        name: '',
        breed: '',
        age: '',
        price: '',
        description: ''
      });
    } catch (error) {
      console.error('Error adding cat:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    }
  };

  // ฟังก์ชันลบข้อมูลแมว
  const handleDeleteCat = async (id) => {
    if (window.confirm('คุณแน่ใจที่จะลบข้อมูลนี้?')) {
      try {
        await deleteDoc(doc(db, 'cats', id));
        setCats(cats.filter(cat => cat.id !== id));
      } catch (error) {
        console.error('Error deleting cat:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  // ฟังก์ชันอัพเดทข้อมูลแมว
  const handleUpdateCat = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, 'cats', id), updatedData);
      setCats(cats.map(cat => 
        cat.id === id ? { ...cat, ...updatedData } : cat
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating cat:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
    }
  };

  return (
    <div className="cat-store-container">
      {/* Header */}
      <header className="header flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">🐱 ระบบจัดการข้อมูลการขายแมว 🐱</h1>
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          ออกจากระบบ
        </button>
      </header>

      {/* ฟอร์มเพิ่มข้อมูล */}
      <form onSubmit={handleAddCat} className="add-cat-form">
        <h2 className="form-title">เพิ่มข้อมูลแมว</h2>
        <div className="form-grid">
          <input
            type="text"
            placeholder="ชื่อแมว"
            value={newCat.name}
            onChange={(e) => setNewCat({...newCat, name: e.target.value})}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="สายพันธุ์"
            value={newCat.breed}
            onChange={(e) => setNewCat({...newCat, breed: e.target.value})}
            className="form-input"
            required
          />
          <input
            type="number"
            placeholder="อายุ (เดือน)"
            value={newCat.age}
            onChange={(e) => setNewCat({...newCat, age: e.target.value})}
            className="form-input"
            required
          />
          <input
            type="number"
            placeholder="ราคา (บาท)"
            value={newCat.price}
            onChange={(e) => setNewCat({...newCat, price: e.target.value})}
            className="form-input"
            required
          />
          <textarea
            placeholder="รายละเอียด"
            value={newCat.description}
            onChange={(e) => setNewCat({...newCat, description: e.target.value})}
            className="form-input form-textarea"
          />
        </div>
        <button type="submit" className="submit-button">
          เพิ่มข้อมูล
        </button>
      </form>

      {/* แสดงรายการแมว */}
      {loading ? (
        <div className="loading">กำลังโหลดข้อมูล... 🐾</div>
      ) : (
        <div className="cats-grid">
          {cats.map(cat => (
            <div key={cat.id} className="cat-card">
              {editingId === cat.id ? (
                <div className="form-grid">
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleUpdateCat(cat.id, { name: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="text"
                    value={cat.breed}
                    onChange={(e) => handleUpdateCat(cat.id, { breed: e.target.value })}
                    className="form-input"
                  />
                  <button
                    onClick={() => setEditingId(null)}
                    className="submit-button"
                  >
                    บันทึก
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="cat-name">{cat.name}</h3>
                  <p className="cat-info">🏷️ สายพันธุ์: {cat.breed}</p>
                  <p className="cat-info">📅 อายุ: {cat.age} เดือน</p>
                  <p className="cat-info">💰 ราคา: {cat.price.toLocaleString()} บาท</p>
                  <p className="cat-description">📝 {cat.description}</p>
                  <div className="card-buttons">
                    <button
                      onClick={() => setEditingId(cat.id)}
                      className="edit-button"
                    >
                      ✏️ แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteCat(cat.id)}
                      className="delete-button"
                    >
                      🗑️ ลบ
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatList;
