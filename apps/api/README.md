# 강아지 분석 API

이 API는 Google AI Studio를 사용하여 강아지 이미지를 분석하고 강아지의 특성에 대한 정보를 제공합니다.

## 설정

1. `.env.example`을 복사하여 `.env`로 만들고 Google AI API 키를 입력하세요:
   ```
   cp .env.example .env
   ```

2. 의존성 설치:
   ```
   npm install
   ```

3. 서버 실행:
   ```
   npm run dev
   ```

## API 엔드포인트

### POST /analyze

강아지 이미지를 분석하고 특성을 반환합니다.

**요청:**
- Content-Type: `multipart/form-data`
- Body:
  - `text`: 설명 또는 컨텍스트 문자열 (최대 100자)
  - `images`: 최대 3장의 강아지 이미지 파일

**응답:**
```json
{
  "breed": "골든 리트리버",
  "size": "대형",
  "fur_type": "장모",
  "fur_color": "황금색",
  "unique_features": "친근하고 활발함"
}
```

**오류 응답:**
- 400 Bad Request: 텍스트가 100자를 초과하거나, 이미지가 제공되지 않았거나, 3장 이상의 이미지가 업로드된 경우
- 500 Internal Server Error: 이미지 분석에 문제가 있는 경우

## 사용 예시

curl 사용:
```bash
curl -X POST \
  http://localhost:5001/analyze \
  -F 'text=우리 강아지는 공 던지기를 좋아해요' \
  -F 'images=@/path/to/dog1.jpg' \
  -F 'images=@/path/to/dog2.jpg'
```
