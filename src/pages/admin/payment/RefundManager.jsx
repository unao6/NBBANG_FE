import { Box, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CircularProgress from "@mui/material/CircularProgress";
import RefundModal from "./fragments/RefundModal";
import { cancelPayment } from "../../../api/payment/kakaoPay/kakaoPayApi";
import { getPaymentsByStatus } from "../../../api/payment/paymentApi";

const RefundManager = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("REFUND_REQUESTED");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [size] = useState(10); // 페이지 당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getPaymentsByStatus(filter, page, size);
        setPayments(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filter, page, size]);

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
      const cancelRequest = {
        tid: selectedPayment.tid,
        cid: selectedPayment.cid,
        cancel_amount: selectedPayment.refundAmount,
        cancel_tax_free_amount: refundData.cancelTaxFreeAmount,
        // cancel_vat_amount: refundData.cancelVatAmount,
        // cancel_available_amount: refundData.cancelAvailableAmount,
        payload: refundData.payload,
      };
      await cancelPayment(cancelRequest);
      alert("환불 요청이 성공적으로 제출되었습니다.");
      closeModal();
      // 데이터 새로고침
      const response = await getPaymentsByStatus(filter, page, size);
      setPayments(response.data.content);
    } catch (error) {
      alert("환불 요청 중 오류가 발생했습니다.");
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageClick(i)}
          sx={{
            margin: "0 4px",
            minWidth: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: i === page ? "#e0e0e0" : "transparent",
            color: i === page ? "black" : "inherit",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          {i + 1}
        </Button>,
      );
    }
    return pages;
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
          상태 필터:
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
                TID(주문번호)
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
                Refund Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Refund Date
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
                  {payment.paymentType || "N/A"} {/* 기본값 설정 */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.refundAmount || "N/A"} {/* 기본값 설정 */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.refundDate
                    ? new Date(payment.refundDate).toLocaleString()
                    : "N/A"}{" "}
                  {/* 기본값 설정 및 포맷팅 */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paymentApprovedAt
                    ? new Date(payment.paymentApprovedAt).toLocaleString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.status === "REFUND_REQUESTED" && (
                    <button
                      onClick={() => openModal(payment)}
                      className="bg-primary text-white px-4 py-2 rounded"
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
      {/* 페이지네이션 버튼 및 페이지 번호 */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <IconButton
          onClick={handlePreviousPage}
          disabled={page === 0}
          sx={{
            backgroundColor: "#e0e0e0",
            marginRight: "8px",
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        {renderPageNumbers()}
        <IconButton
          onClick={handleNextPage}
          disabled={page >= totalPages - 1}
          sx={{
            backgroundColor: "#e0e0e0",
            marginLeft: "8px",
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <RefundModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleRefundSubmit}
        initialCancelAmount={selectedPayment ? selectedPayment.refundAmount : 0}
      />
    </div>
  );
};

export default RefundManager;
