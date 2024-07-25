import React, { useState } from 'react';

const RefundModal = ({ isOpen, onClose, onSubmit }) => {
  const [cancelAmount, setCancelAmount] = useState('');
  const [cancelTaxFreeAmount, setCancelTaxFreeAmount] = useState('');
  const [cancelVatAmount, setCancelVatAmount] = useState('');
  const [cancelAvailableAmount, setCancelAvailableAmount] = useState('');
  const [payload, setPayload] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      cancelAmount: parseInt(cancelAmount, 10),
      cancelTaxFreeAmount: parseInt(cancelTaxFreeAmount, 10),
      cancelVatAmount: parseInt(cancelVatAmount, 10),
      cancelAvailableAmount: parseInt(cancelAvailableAmount, 10),
      payload,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl mb-4">환불 정보 입력</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">취소 금액</label>
            <input
              type="number"
              value={cancelAmount}
              onChange={(e) => setCancelAmount(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">비과세 금액</label>
            <input
              type="number"
              value={cancelTaxFreeAmount}
              onChange={(e) => setCancelTaxFreeAmount(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">부가세 금액</label>
            <input
              type="number"
              value={cancelVatAmount}
              onChange={(e) => setCancelVatAmount(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">취소 가능 금액</label>
            <input
              type="number"
              value={cancelAvailableAmount}
              onChange={(e) => setCancelAvailableAmount(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Payload</label>
            <input
              type="text"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 py-2 px-4 bg-gray-500 text-white rounded"
            >
              취소
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded"
            >
              제출
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundModal;
