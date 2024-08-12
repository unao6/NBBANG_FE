import axiosInterceptors from "../axiosInterceptors.js";

const paymentUrl = `/api/payment`;

export const getPayments = (page, size) => {
  return axiosInterceptors.get(`${paymentUrl}/list`, {
    params: { page, size },
  });
};

export const getUserPayments = async () => {
  return axiosInterceptors.get(`${paymentUrl}/user`);
};

export const getPaymentsByPartnerUserId = (partnerUserId, page, size) => {
  return axiosInterceptors.get(`${paymentUrl}/list/user/${partnerUserId}`, {
    params: { page, size },
  });
};

// 페이지네이션을 지원하도록 수정된 getPaymentsByStatus 함수
export const getPaymentsByStatus = async (status, page = 0, size = 10) => {
  return axiosInterceptors.get(`${paymentUrl}/status/${status}`, {
    params: { page, size },
  });
}; // 여기 닫는 중괄호가 필요합니다.

// 새로운 TID로 검색하는 API 추가
export const getPaymentsByTid = async (tid, page, size) => {
  return axiosInterceptors.get(`${paymentUrl}/list/tid/${tid}`, {
    params: { page, size },
  });
};

//환불 정보 조회 API
export const getRefundInfo = async (partyId) => {
  try {
    const response = await axiosInterceptors.get(
      `${paymentUrl}/refund/${partyId}/info`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 환불 요청 API
export const requestRefund = async (ottId) => {
  try {
    const response = await axiosInterceptors.post(
      `${paymentUrl}/refund/${ottId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCardInfo = async () => {
  try {
    const response = await axiosInterceptors.get(`/api/card/info`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const deleteCardInfo = async () => {
  return axiosInterceptors.delete(`/api/card/delete`);
};
