# Node.js를 사용하여 React 프로젝트 빌드 및 서빙
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 설치를 위해 package.json과 package-lock.json을 복사
COPY package.json package-lock.json ./

# dependencies 설치
RUN npm install

# 프로젝트 소스 복사
COPY . .

# React 프로젝트 빌드
RUN npm run build

# 정적 파일을 서빙할 경로 설정
ENV NODE_ENV=production
ENV PORT=3000

# Serve를 사용하여 정적 파일을 제공
RUN npm install -g serve

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행 (빌드된 정적 파일 서빙)
CMD ["serve", "-s", "build", "-l", "3000"]

# docker build -t kimhyeonpil/react-image .
# docker push kimhyeonpil/react-image
# docker pull kimhyeonpil/react-image
# docker run -d -p 80:3000 --name react-server kimhyeonpil/react-image