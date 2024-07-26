import React, { useEffect, useState } from "react";
import {
  getPaymentsByStatus,
  requestRefund,
} from "../../../api/payment/paymentApi";

import CircularProgress from "@mui/material/CircularProgress";
import RefundModal from "./fragments/RefundModal";

const RefundManager = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("REFUND_REQUESTED");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getPaymentsByStatus(filter);
        setPayments(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleRefundSubmit = async (refundData) => {
    try {
      await requestRefund(selectedPayment.id, refundData);
      alert("환불 요청이 성공적으로 제출되었습니다.");
      closeModal();
      // 데이터 새로고침
      const response = await getPaymentsByStatus(filter);
      setPayments(response.data);
    } catch (error) {
      alert("환불 요청 중 오류가 발생했습니다.");
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
      <h1 className="text-2xl mb-4">환불 관리</h1>
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2">
          Filter by status:
        </label>
        <select
          id="statusFilter"
          value={filter}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded p-2 w-60"
        >
          <option value="REFUND_REQUESTED">환불 요청</option>
          <option value="REFUNDED_COMPLETED">환불 완료</option>
          <option value="REFUND_FAILED">환불 실패</option>
          <option value="REFUND_CANCELLED">환불 취소</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Approved At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {payment.tid}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.partnerUserId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.partnerOrderId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paymentType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paymentApprovedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.status === "REFUND_REQUESTED" && (
                    <button
                      onClick={() => openModal(payment)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      환불 정보 입력
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RefundModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleRefundSubmit}
      />
    </div>
  );
};

export default RefundManager;
