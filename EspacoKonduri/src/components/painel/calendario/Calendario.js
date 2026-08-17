import React, { useState } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  padding: 20px;
`;

const CalendarCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 12px;
  overflow: hidden;
`;

const CalendarHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;
`;

const CalendarTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #3D2C22;
`;

const LegendRow = styled.View`
  flex-direction: row;
  justify-content: center;
  padding: 4px 8px 8px 8px;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 10px;
`;

const LegendDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.color};
  margin-right: 5px;
`;

const LegendText = styled.Text`
  font-size: 11px;
  color: #8C7355;
`;

function paraDataISO(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export default function Calendario({
  value,
  onChange,
  renderTrigger,
  diasComVenda = [],
  diasComComissao = [],
  onMonthChange,
}) {
  const [visible, setVisible] = useState(false);

  const dataSelecionadaISO = paraDataISO(value);
  const diasComComissaoSet = new Set(diasComComissao);

  const markedDates = {};

  // Fundo colorido no dia inteiro (mais chamativo que bolinha):
  // laranja = teve venda; verde = teve venda e comissão já definida
  diasComVenda.forEach((dataISO) => {
    const jaTemComissao = diasComComissaoSet.has(dataISO);
    markedDates[dataISO] = {
      customStyles: {
        container: {
          backgroundColor: jaTemComissao ? '#D4EDDA' : '#FDEBD3',
          borderRadius: 8,
        },
        text: {
          color: jaTemComissao ? '#1E7E34' : '#B85D00',
          fontWeight: 'bold',
        },
      },
    };
  });

  // O dia selecionado sempre sobrescreve com destaque escuro,
  // mesmo que também tenha venda/comissão
  markedDates[dataSelecionadaISO] = {
    customStyles: {
      container: {
        backgroundColor: '#3D2C22',
        borderRadius: 8,
      },
      text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
    },
  };

  const handleDayPress = (day) => {
    const [ano, mes, dia] = day.dateString.split('-').map(Number);
    const novaData = new Date(ano, mes - 1, dia);
    onChange(novaData);
    setVisible(false);
  };

  return (
    <>
      {renderTrigger({ onPress: () => setVisible(true) })}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Overlay>
          <CalendarCard>
            <CalendarHeader>
              <CalendarTitle>Selecionar Data</CalendarTitle>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={22} color="#3D2C22" />
              </TouchableOpacity>
            </CalendarHeader>

            <Calendar
              current={dataSelecionadaISO}
              markedDates={markedDates}
              markingType="custom"
              onDayPress={handleDayPress}
              onMonthChange={(month) => {
                if (onMonthChange) {
                  const anoMes = `${month.year}-${String(month.month).padStart(2, '0')}`;
                  onMonthChange(anoMes);
                }
              }}
              theme={{
                todayTextColor: '#E67E22',
                arrowColor: '#2E5A1E',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
              }}
            />

            <LegendRow>
              <LegendItem>
                <LegendDot color="#FDEBD3" />
                <LegendText>Venda registrada</LegendText>
              </LegendItem>
              <LegendItem>
                <LegendDot color="#D4EDDA" />
                <LegendText>Comissão definida</LegendText>
              </LegendItem>
            </LegendRow>
          </CalendarCard>
        </Overlay>
      </Modal>
    </>
  );
}