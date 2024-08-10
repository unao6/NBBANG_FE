import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { getAllOtt, deleteOtt } from '../../../api/ott/ottApi';
import OttForm from './OttForm';

const OttList = () => {
  const [otts, setOtts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOttId, setSelectedOttId] = useState(null);

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

    setSelectedOttId(ottId);
  };

  const handleSave = async () => {
    setSelectedOttId(null);
    await fetchOtts();
  };

  const handleDelete = async (ottId) => {
    console.log('Deleting OTT with ID:', ottId); // 디버깅용 로그 추가
    try {
      await deleteOtt(ottId);
      await fetchOtts();
    } catch (error) {
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
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">OTT Management</h1>
      <OttForm ottId={selectedOttId} onSave={handleSave} />
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              OTT 이름
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              구독 가격
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              인원 수
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              수정/삭제
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {otts.map((ott) => (
            <tr key={ott.ottId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {ott.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {ott.price}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {ott.capacity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
