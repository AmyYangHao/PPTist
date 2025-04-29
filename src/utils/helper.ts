export function base64ToFile(base64String: string, filename: string, type = 'image/png') {
  // 提取 Base64 数据部分（去掉 data:image/png;base64, 前缀）
  const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;

  // 将 Base64 解码为字节数组
  const byteString = atob(base64Data);
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  // 创建文件对象
  const file = new File([byteArray], filename, { type });
  return file;
}