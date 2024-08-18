function dataURIToBlob(dataURI) {
  // dataURI에서 MIME 타입과 Base64 데이터를 분리
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // 바이너리 데이터의 길이를 기반으로 ArrayBuffer 생성
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  // 바이너리 데이터를 ArrayBuffer에 채우기
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Blob 객체 생성
  return new Blob([ab], { type: mimeString });
}

export function dataURIToFile(dataURI, filename) {
  // Blob 객체로 변환
  const blob = dataURIToBlob(dataURI);

  // File 객체 생성
  return new File([blob], filename, { type: blob.type });
}
