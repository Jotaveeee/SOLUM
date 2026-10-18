import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // CONTAINER
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },

  container: {
    flex: 1,
  },

  conteudo: {
    paddingHorizontal: 18,
    paddingTop: 0,
    paddingBottom: 35,
  },

  // CABEÇALHO SUPERIOR
  topoPagina: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 46,
    marginTop: 38,
    marginBottom: 20,
  },

  botaoVoltar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },

  tituloPagina: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 17,
    color: '#202820',
  },

  espacoTopo: {
    width: 42,
  },

  // CARD DE IDENTIFICAÇÃO
  cabecalho: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  cabecalhoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cabecalhoIcone: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#E4F3E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  cabecalhoTexto: {
    flex: 1,
    minWidth: 0,
  },

  titulo: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 15,
    color: '#202820',
  },

  subtitulo: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },

  ultimaAtualizacao: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11,
    color: '#888888',
    marginTop: 15,
  },

  botaoConfiguracoes: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E4F3E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },

  // TÍTULOS DAS SEÇÕES
  secaoTitulo: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: '#202820',
    marginBottom: 13,
  },

  // Compatibilidade com os estilos usados no index.js
  section: {
    marginBottom: 0,
  },

  tituloSecao: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: '#202820',
    marginBottom: 8,
  },

  // ALERTAS
  alertCard: {
    width: '100%',
    minHeight: 70,
    backgroundColor: '#FFF0D9',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginTop: 12,
    marginBottom: 25,
  },

  alertIcone: {
    marginRight: 12,
  },

  alertText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#444444',
  },

  // LEITURAS ATUAIS
  leiturasLinha: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: 13,
  },

  leituraCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginHorizontal: 5,
    minHeight: 154,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  leituraIcone: {
    width: 41,
    height: 41,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
  },

  leituraLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 11,
    color: '#777777',
  },

  leituraValor: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 23,
    color: '#202820',
    marginTop: 5,
  },

  leituraDescricao: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 10,
    color: '#999999',
    marginTop: 4,
  },

  // BATERIA
  bateriaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 16,
    marginBottom: 27,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  bateriaIcone: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E4F3E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  bateriaConteudo: {
    flex: 1,
  },

  bateriaTextoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  bateriaTitulo: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 12,
    color: '#555555',
  },

  bateriaValor: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 13,
    color: '#249057',
  },

  bateriaTrilho: {
    height: 7,
    backgroundColor: '#E7E7E7',
    borderRadius: 10,
    overflow: 'hidden',
  },

  bateriaProgresso: {
    height: '100%',
    backgroundColor: '#249057',
    borderRadius: 10,
  },

  // MÉDIAS DO HISTÓRICO
  mediasLinha: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: 27,
  },

  mediaCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  mediasCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  mediasTitulo: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 15,
    color: '#202820',
  },

  infoPeriodo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EC',
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginTop: -4,
    marginBottom: 16,
  },

  infoPeriodoTexto: {
    flex: 1,
    marginLeft: 9,
  },

  infoPeriodoTitulo: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#246B42',
  },

  infoPeriodoDescricao: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 10,
    color: '#547260',
    marginTop: 3,
  },

  filtrosPeriodo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  filtroPeriodo: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  filtroPeriodoAtivo: {
    backgroundColor: '#249057',
  },

  filtroPeriodoTexto: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#6B7280',
  },

  filtroPeriodoTextoAtivo: {
    color: '#FFFFFF',
  },

  mediaLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 11,
    color: '#777777',
  },

  mediaValor: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 22,
    marginTop: 8,
  },

  mediaDescricao: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 10,
    color: '#999999',
    marginTop: 5,
  },

  // GRÁFICOS
  graficoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  graficoTituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  graficoIcone: {
    width: 41,
    height: 41,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  graficoTituloTexto: {
    flex: 1,
  },

  graficoTitulo: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 14,
    color: '#202820',
  },

  graficoSubtitulo: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
  },

  grafico: {
    flexDirection: 'row',
    height: 190,
  },

  eixoY: {
    width: 37,
    height: 160,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: 5,
  },

  eixoTexto: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 9,
    color: '#888888',
    includeFontPadding: false,
  },

  graficoPlot: {
    flex: 1,
    height: 190,
    position: 'relative',
  },

  graficoScrollConteudo: {
    height: 190,
    position: 'relative',
  },

  linhasGrade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    justifyContent: 'space-between',
  },

  linhaGrade: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  barrasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 190,
    flexDirection: 'row',
  },

  linhaGraficoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 190,
  },

  segmentoLinha: {
    position: 'absolute',
    height: 2,
    borderRadius: 2,
  },

  pontoLinha: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  rotuloLinha: {
    position: 'absolute',
    top: 169,
    left: -22,
  },

  barraColuna: {
    width: 44,
    flexShrink: 0,
    alignItems: 'center',
  },

  barraEspaco: {
    width: '100%',
    height: 160,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },

  barra: {
    width: '70%',
    minWidth: 4,
    maxWidth: 22,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  barraHorario: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 9,
    color: '#888888',
    marginTop: 9,
    width: 44,
    textAlign: 'center',
  },

  legendaGrafico: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendaBolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  legendaTexto: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11,
    color: '#777777',
  },

  mediaGrafico: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 12,
    color: '#333333',
  },

  // CABEÇALHO DO HISTÓRICO
  historicoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 3,
  },

  historicoCabecalhoTexto: {
    flex: 1,
  },

  historicoSubtitulo: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11,
    color: '#888888',
    marginTop: -7,
    marginBottom: 13,
  },

  historicoContador: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: '#E4F3E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginBottom: 14,
  },

  historicoContadorTexto: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 12,
    color: '#249057',
  },

  // ITENS DO HISTÓRICO
  historicoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  botaoCarregarMais: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#E8F5EC',
    borderRadius: 14,
    marginBottom: 18,
  },

  textoCarregarMais: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 12,
    color: '#249057',
  },

  historicoData: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  historicoIcone: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E4F3E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  historicoHorario: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 12,
    color: '#333333',
  },

  historicoDataTexto: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 10,
    color: '#999999',
    marginTop: 4,
  },

  historicoMedicoes: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },

  historicoMedicao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },

  historicoMedicaoTexto: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 12,
    color: '#333333',
    marginLeft: 5,
  },

  // HISTÓRICO VAZIO
  vazioCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 25,
    marginBottom: 20,
  },

  vazioTitulo: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 14,
    color: '#444444',
    marginTop: 12,
    textAlign: 'center',
  },

  vazioTexto: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 7,
  },
});

export default styles;
