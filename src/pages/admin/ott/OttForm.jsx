import React, { useState, useEffect } from 'react';
import { createOtt, getOttById, updateOtt } from '../../../api/ott/ottApi';

const OttForm = ({ ottId, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
      setCapacity(initialData.capacity);
    } else if (ottId) {
      fetchOtt(ottId);
    } else {
      setName('');
      setPrice('');
      setCapacity('');
    }
  }, [ottId, initialData]);

  const fetchOtt = async (ottId) => {
    try {
      const response = await getOttById(ottId);
      const { name, price, capacity } = response.data;
      setName(name);
      setPrice(price);
      setCapacity(capacity);
    } catch (error) {
      console.error('Error fetching OTT:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ottUpdateRequest = { name, price: parseInt(price, 10), capacity: parseInt(capacity, 10) };

    try {
      if (ottId) {
        await updateOtt(ottId, ottUpdateRequest); // ottId를 URL에 포함시켜 호출
      } else {
        await createOtt(ottUpdateRequest);
      }
      onSave();
    } catch (error) {
      console.error('Error saving OTT:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded px-6 pt-4 pb-6 mb-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            OTT 이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            구독 가격
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            인원 수
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-end space-x-4">
          {ottId ? (
            <>
              <button
                type="submit"
                className="bg-primary hover:bg-accent text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline w-24"
              >
                수정
              </button>
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline w-24"
                onClick={() => onSave(null)} // 폼 초기화 및 수정 모드 종료
              >
                취소
              </button>
            </>
          ) : (
            <div className="flex justify-end w-full">
              <button
                type="submit"
                className="bg-primary hover:bg-accent text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline w-24"
              >
                등록
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default OttForm;
