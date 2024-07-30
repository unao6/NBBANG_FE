import React, { useState, useEffect } from 'react';
import { createOtt, getOttById, updateOtt } from '../../../api/ott/ottApi';

const OttForm = ({ ottId, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    if (ottId) {
      fetchOtt(ottId);
    } else {
      setName('');
      setPrice('');
      setCapacity('');
    }
  }, [ottId]);

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
    const ottData = { name, price: parseInt(price, 10), capacity: parseInt(capacity, 10) };

    try {
      if (ottId) {
        await updateOtt(ottId, ottData);
      } else {
        await createOtt(ottData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving OTT:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4 max-w-4xl mx-auto">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-col items-start">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            OTT 이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            구독 가격
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            인원 수
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          등록
        </button>
      </div>
    </form>
  );
};

export default OttForm;