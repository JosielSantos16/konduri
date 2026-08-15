const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export async function uploadProductImage(localUri) {
  const formData = new FormData();

  formData.append('image', {
    uri: localUri,
    type: 'image/jpeg',
    name: 'produto.jpg',
  });

  const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const resultado = await response.json();

  if (!resultado.success) {
    throw new Error('Falha ao enviar imagem.');
  }

  return resultado.data.url;
}