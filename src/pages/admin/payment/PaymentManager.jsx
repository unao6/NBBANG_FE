import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getPayments,
  getPaymentsByPartnerUserId,
  getPaymentsByTid,
} from "../../../api/payment/paymentApi";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CircularProgress from "@mui/material/CircularProgress";

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [size] = useState(10); // 페이지 당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [searchValue, setSearchValue] = useState(""); // 검색할 값 (TID 또는 userId)
  const [searchType, setSearchType] = useState("userId"); // 검색 유형 (TID 또는 userId)
  const [queryValue, setQueryValue] = useState(""); // 실제로 쿼리에 사용될 검색 값

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let response;
      if (queryValue) {
        if (searchType === "userId") {
          response = await getPaymentsByPartnerUserId(queryValue, page, size);
        } else if (searchType === "tid") {
          response = await getPaymentsByTid(queryValue, page, size);
        }
      } else {
        response = await getPayments(page, size);
      }

      setPayments(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, queryValue]);

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

  const handleSearch = () => {
    setQueryValue(searchValue); // 실제로 쿼리에 사용할 값 설정
    setPage(0); // 검색 시 페이지 번호를 0으로 초기화
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">결제 관리</h1>
      {/* 검색 필드 */}
      <Box display="flex" alignItems="center" mb={4}>
        <FormControl
          variant="outlined"
          size="small"
          sx={{ marginRight: "8px", minWidth: "120px" }}
        >
          <InputLabel id="search-type-label">검색 유형</InputLabel>
          <Select
            labelId="search-type-label"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            label="검색 유형"
          >
            <MenuItem value="userId">User ID</MenuItem>
            <MenuItem value="tid">TID</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label={searchType === "userId" ? "User ID 검색" : "TID 검색"}
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ marginRight: "8px" }}
        />
        <Button variant="contained" onClick={handleSearch}>
          검색
        </Button>
      </Box>
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
                  {payment.paymentType ? payment.paymentType:""}
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
    </div>
  );
};

export default PaymentManager;
