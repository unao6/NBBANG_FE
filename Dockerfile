# 1. 기본 Node.js 이미지 사용
FROM node:18 AS build

# 2. 작업 디렉토리 생성 및 이동
WORKDIR /app

# 3. 의존성 파일 복사
COPY package.json package-lock.json ./

# 4. 의존성 설치
RUN npm install

# 5. 애플리케이션 소스 코드 복사
COPY . .

# 6. 리액트 애플리케이션 빌드
RUN npm run build

# 7. 최종 이미지 구성
FROM nginx:alpine

# 8. 빌드된 애플리케이션을 Nginx의 HTML 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 9. Nginx가 기본 포트 80에서 실행되도록 설정
EXPOSE 80

# 10. Nginx 시작
CMD ["nginx", "-g", "daemon off;"]