
import { StyleSheet } from 'react-native';

export const fontNames = {
  regular: 'PlusJakarta-Regular',
  bold: 'PlusJakarta-Bold',
};

export const colors = {
  background: '#F0F0F0',
  surface: '#FFFFFF',
  primary: '#249057',
  text: '#222222',
  textSecondary: '#9CA3AF',
  border: '#E8E8E8',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  conteudoScroll: {
  paddingHorizontal: 20,
  paddingTop: 30,
  paddingBottom: 130,
  flexGrow: 1,
},

  // Resumo dos alarmes
  resumoCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 26,

    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },

  resumoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  resumoIcone: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E8F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },

  resumoTexto: {
    flex: 1,
    minWidth: 0,
  },

  resumoTitulo: {
    fontFamily: fontNames.bold,
    fontSize: 15,
    color: colors.text,
  },

  resumoDescricao: {
    fontFamily: fontNames.regular,
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
    lineHeight: 17,
  },

  resumoDivisor: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },

  resumoIndicadores: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  indicador: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },

  indicadorPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 7,
  },

  indicadorValor: {
    fontFamily: fontNames.bold,
    fontSize: 20,
    color: colors.text,
  },

  indicadorLabel: {
    fontFamily: fontNames.regular,
    fontSize: 11,
    color: '#777777',
    marginTop: 4,
    textAlign: 'center',
  },

  indicadorSeparador: {
    width: 1,
    height: 43,
    backgroundColor: colors.border,
    marginHorizontal: 5,
  },

  // Lista de registros
  secao: {
    width: '100%',
    marginBottom: 18,
  },

  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 14,
    gap: 8,
  },

  tituloSecao: {
    fontFamily: fontNames.bold,
    fontSize: 17,
    color: colors.text,
    flexShrink: 1,
  },

  contador: {
    fontFamily: fontNames.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },

  // Cards clicáveis dos alarmes
  alarmeCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderWidth: 0,

    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 4,
  },

  alarmeIcone: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },

  alarmeConteudo: {
    flex: 1,
    minWidth: 0,
  },

  alarmeTitulo: {
    fontFamily: fontNames.bold,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 6,
    flexShrink: 1,
  },

  alarmeDescricao: {
    fontFamily: fontNames.regular,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },

  alarmeInformacoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  alarmeInformacao: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 4,
  },

  alarmeInformacaoTexto: {
    fontFamily: fontNames.regular,
    fontSize: 10,
    color: colors.textSecondary,
    flexShrink: 1,
  },

  alarmeSeta: {
    marginLeft: 5,
    marginTop: 10,
    flexShrink: 0,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  statusTexto: {
    fontFamily: fontNames.bold,
    fontSize: 10,
  },

  // Estado vazio
  estadoVazio: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  estadoVazioTitulo: {
    fontFamily: fontNames.bold,
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    marginTop: 12,
  },

  estadoVazioDescricao: {
    fontFamily: fontNames.regular,
    fontSize: 12,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
  },

  // Cartão clicável do histórico
  historicoCard: {
    width: '100%',
    minHeight: 82,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 24,

    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  historicoIcone: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E8F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },

  historicoTexto: {
    flex: 1,
    minWidth: 0,
  },

  historicoTitulo: {
    fontFamily: fontNames.bold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
    flexShrink: 1,
  },

  historicoDescricao: {
    fontFamily: fontNames.regular,
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 17,
    flexShrink: 1,
  },
});

export default styles;
