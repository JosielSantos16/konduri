const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

export async function enviarPushExpo({ pushToken, titulo, mensagem, dados }) {
  if (!pushToken || !pushToken.startsWith('ExponentPushToken')) {
    console.log('Token inválido ou ausente, pulando envio de push:', pushToken);
    return;
  }

  try {
    await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: pushToken,
        sound: 'default',
        title: titulo,
        body: mensagem,
        data: dados || {},
        priority: 'high',
        channelId: 'default',
      }),
    });
  } catch (erro) {
    console.error('Erro ao enviar push notification:', erro);
  }
}