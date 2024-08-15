import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { getAllOtt, deleteOtt } from '../../../api/ott/ottApi';
import OttForm from './OttForm';

const OttList = () => {
  const [otts, setOtts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOttId, setSelectedOttId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchOtts();
  }, []);

  const fetchOtts = async () => {
    try {
      const response = await getAllOtt();
      setOtts(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleEdit = (ottId) => {
    const selectedOtt = otts.find((ott) => ott.ottId === ottId);
    setEditData(selectedOtt);
    setSelectedOttId(ottId);
    setIsEditMode(true);
  };

  const handleSave = async () => {
    setSelectedOttId(null);
    setIsEditMode(false);
    setEditData(null);
    await fetchOtts();
  };

  const handleDelete = async (ottId) => {
    try {
      await deleteOtt(ottId);
      await fetchOtts();
    } catch (error) {
      alert("삭제할 수 없는 OTT 입니다.");
      console.error('Error deleting OTT:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error.message}</div>;
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800">OTT 관리</h1>
      </div>
      <div className="mb-6">
        {isEditMode ? (
          <OttForm ottId={selectedOttId} onSave={handleSave} initialData={editData} />
        ) : (
          <OttForm onSave={handleSave} />
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                OTT 이름
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                구독 가격
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                인원 수
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                수정/삭제
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {otts.map((ott) => (
              <tr key={ott.ottId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                  {ott.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {ott.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {ott.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => handleEdit(ott.ottId)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 ml-4"
                    onClick={() => handleDelete(ott.ottId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OttList;
