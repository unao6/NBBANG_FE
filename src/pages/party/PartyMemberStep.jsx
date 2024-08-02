import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { partyMatching } from '../../api/party/partyApi';

const PartyMemberStep = () => {
  const { ottId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const matchParty = async () => {
      try {
        // partyMatching API 호출
        await partyMatching();

        // 매칭 성공 시 이미지 페이지로 이동
        navigate('/party-matching-success', {
          state: { imageUrl: '/path/to/uploaded/image.png' }
        });
      } catch (error) {
        console.error('파티 매칭 중 오류 발생:', error);
      }
    };

    matchParty();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <p>파티 매칭 중입니다...</p>
    </div>
  );
};

export default PartyMemberStep;
