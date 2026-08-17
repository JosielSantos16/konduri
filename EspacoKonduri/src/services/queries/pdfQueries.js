import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export async function exportarFechamentoPDF({ data, produtos, totalEntradas, totalSaidas, responsavel }) {
  const linhasProdutos = produtos
    .map(
      (p) => `
      <tr>
        <td>${p.nome}</td>
        <td>${p.estoqueInicial}</td>
        <td>${p.entradaQtd}</td>
        <td>${p.saidaQtd}</td>
        <td>R$ ${p.valorEntradas.toFixed(2)}</td>
        <td>R$ ${p.valorSaidas.toFixed(2)}</td>
        <td>${p.saldoEstoque}</td>
      </tr>`
    )
    .join('');

  const html = `
    <html>
      <body style="font-family: Arial; padding: 20px;">
        <h1 style="color: #2E5A1E;">Espaço Konduri — Fechamento de Caixa</h1>
        <p><strong>Data:</strong> ${data}</p>
        <p><strong>Conferido por:</strong> ${responsavel}</p>
        <table border="1" cellpadding="6" style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <tr style="background: #F0EAE1;">
            <th>Produto</th><th>Est. Inicial</th><th>Entrada</th><th>Saída</th>
            <th>Vlr Entradas</th><th>Vlr Saídas</th><th>Saldo</th>
          </tr>
          ${linhasProdutos}
        </table>
        <h3 style="margin-top: 20px;">Totais do Dia</h3>
        <p>Total Entradas: R$ ${totalEntradas.toFixed(2)}</p>
        <p>Total Saídas: R$ ${totalSaidas.toFixed(2)}</p>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}