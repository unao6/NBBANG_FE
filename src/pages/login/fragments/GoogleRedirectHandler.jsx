import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInterceptors from "../../../api/axiosInterceptors";

const GoogleRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // axiosInterceptors를 사용하여 요청을 보냅니다.
        const response = await axiosInterceptors.get("/api/auth/token", {
          withCredentials: true, // 쿠키를 포함하여 요청을 보냄
        });

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.status === 200) {
          throw new Error("토큰 요청 실패");
        }

        const token = response.headers['access'];
        const hasPhoneNumber = response.headers['hasPhoneNumber'] === "true";

        if (token) {
          localStorage.setItem("access", token);
          console.log("JWT 토큰을 로컬 스토리지에 저장했습니다.");

          // 토큰이 있는 경우, 전화번호가 등록되어 있는지 확인하는 API 호출
          const phoneCheckResponse = await axiosInterceptors.get("/api/users/user-info", {
            headers: {
              "access": `${token}`,
            },
          });

          if (!phoneCheckResponse.status === 200) {
            throw new Error("전화번호 확인 요청 실패");
          }

          const phoneCheckResult = phoneCheckResponse.data;

          if (phoneCheckResult.phoneNumber) {
            // 전화번호가 등록되어 있으면 마이페이지로 리다이렉트
            window.opener.location.href = "/";
          } else {
            // 전화번호가 없으면 전화번호 추가 페이지로 리다이렉트
            window.opener.location.href = "/mypage/add-number";
          }
          window.close();
        } else {
          console.error("토큰을 가져오지 못했습니다.");
          if (window.opener) {
            window.opener.location.href = "/login";
          } else {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("토큰을 가져오는 데 실패했습니다:", error);

        if (window.opener) {
          window.opener.location.href = "/login";
        } else {
          navigate("/login");
        }
      } finally {
        if (window.opener) {
          window.close();
        }
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <div>
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default GoogleRedirectHandler;