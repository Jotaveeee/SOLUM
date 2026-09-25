import { StyleSheet, Platform } from 'react-native';

export const fontNames = {
  regular: 'PlusJakarta-Regular',
  bold: 'PlusJakarta-Bold',
};

export default StyleSheet.create({

  /*
   * TELA
   */
  container: {
    flex: 1,

    backgroundColor: '#f0f0f0',
  },

  content: {
    flex: 1,

    width: '100%',

    paddingHorizontal: 20,
  },

  /*
   * CABEÇALHO
   */
  header: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',

    paddingTop: Platform.OS === 'android' ? 28 : 18,
    paddingBottom: 18,
  },

  backButton: {
    width: 45,
    height: 45,

    borderRadius: 23,

    backgroundColor: '#e2e2e2',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  backIcon: {
    fontSize: 38,

    lineHeight: 40,

    color: '#000000',

    fontFamily: fontNames.regular,

    marginTop: -3,
  },

  headerText: {
    flex: 1,

    minWidth: 0,
  },

  fazendaNome: {
    fontSize: 19,

    color: '#000000',

    fontFamily: fontNames.bold,
  },

  /*
   * TÍTULO
   */
  titleContainer: {
    width: '100%',

    marginTop: 3,

    marginBottom: 18,
  },

  titulo: {
    fontSize: 27,

    color: '#000000',

    fontFamily: fontNames.bold,

    marginBottom: 5,
  },

  subtitulo: {
    fontSize: 13,

    lineHeight: 19,

    color: '#666666',

    fontFamily: fontNames.regular,
  },

  /*
   * SCROLL
   */
  scroll: {
    flex: 1,

    width: '100%',
  },

  scrollContent: {
    width: '100%',

    paddingBottom: 20,
  },

  /*
   * CARD
   */
  card: {
    width: '100%',

    backgroundColor: '#ffffff',

    borderRadius: 20,

    padding: 16,

    marginBottom: 15,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 5,

    elevation: 2,
  },

  /*
   * CABEÇALHO DO CARD
   */
  cardHeader: {
    width: '100%',

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 16,
  },

  /*
   * BOLINHA
   */
  sensorIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 11,
  },

  /*
   * O ● CONTINUA TOTALMENTE OPACO
   */
  sensorIconText: {
    fontSize: 17,

    color: '#ffffff',

    opacity: 1,
  },

  /*
   * BOLINHA - NORMAL
   */
  bolinhaNormal: {
    backgroundColor: 'rgba(36, 144, 87, 0.75)',
  },

  /*
   * BOLINHA - ATENÇÃO
   */
  bolinhaAtencao: {
    backgroundColor: 'rgba(231, 165, 38, 0.75)',
  },

  /*
   * BOLINHA - ALERTA MÁXIMO
   */
  bolinhaAlertaMaximo: {
    backgroundColor: 'rgba(217, 54, 54, 0.75)',
  },

  /*
   * NOME DO PROTÓTIPO
   */
  sensorTitleContainer: {
    flex: 1,

    minWidth: 0,

    marginRight: 8,
  },

  sensorNome: {
    fontSize: 15,

    color: '#000000',

    fontFamily: fontNames.bold,

    marginBottom: 3,
  },

  sensorTipo: {
    fontSize: 11,

    color: '#777777',

    fontFamily: fontNames.regular,
  },

  /*
   * STATUS
   */
  status: {
    paddingHorizontal: 9,

    paddingVertical: 5,

    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },

  /*
   * STATUS NORMAL
   */
  statusNormal: {
    backgroundColor: '#e5f5ec',

    borderRadius: 20,
  },

  statusTextNormal: {
    color: '#249057',
  },

  /*
   * STATUS ATENÇÃO
   */
  statusAtencao: {
    backgroundColor: '#fff1d9',

    borderRadius: 20,
  },

  statusTextAtencao: {
    color: '#c47b00',
  },

  /*
   * STATUS ALERTA MÁXIMO
   */
  statusAlertaMaximo: {
    backgroundColor: '#fde4e4',

    borderRadius: 20,
  },

  statusTextAlertaMaximo: {
    color: '#D93636',
  },

  statusText: {
    fontSize: 10,

    fontFamily: fontNames.bold,
  },

  /*
   * DADOS DOS SENSORES
   */
  sensorDataContainer: {
    width: '100%',

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#f7f7f7',

    borderRadius: 14,

    paddingVertical: 14,

    paddingHorizontal: 13,

    marginBottom: 13,
  },

  dataItem: {
    flex: 1,

    minWidth: 0,
  },

  dataLabel: {
    fontSize: 10,

    color: '#777777',

    fontFamily: fontNames.regular,

    marginBottom: 5,
  },

  dataValue: {
    fontSize: 21,

    color: '#000000',

    fontFamily: fontNames.bold,
  },

  divider: {
    width: 1,

    height: 35,

    backgroundColor: '#dddddd',

    marginHorizontal: 12,
  },

  /*
   * BOTÃO
   */
  detailsButton: {
    width: '100%',

    minHeight: 43,

    borderRadius: 13,

    backgroundColor: '#249057',

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 15,
  },

  detailsButtonText: {
    color: '#ffffff',

    fontSize: 13,

    fontFamily: fontNames.bold,
  },

  arrow: {
    color: '#ffffff',

    fontSize: 18,

    fontFamily: fontNames.bold,

    marginLeft: 8,

    marginTop: -1,
  },

  /*
   * FINAL
   */
  bottomSpace: {
    height: 10,
  },

});