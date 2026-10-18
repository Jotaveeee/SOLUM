import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Fundo e rolagem da tela.
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

  // Cabeçalho, título e botão de retorno.
  topoPagina: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 46,
    marginTop: 38,
    marginBottom: 16,
  },
  botaoVoltar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
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

  // Texto introdutório e cartões das seções.
  introducao: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 13,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  // Títulos e ícones usados no início de cada seção.
  tituloSecaoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconeSecao: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tituloSecaoTexto: {
    flex: 1,
  },
  tituloSecao: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 13,
    color: '#202820',
  },

  // Rótulos, explicações e estado de carregamento/erro.
  rotulo: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 11,
    color: '#555555',
    marginBottom: 7,
  },
  nivelAlerta: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '700',
    fontSize: 10,
    color: '#555555',
    marginTop: 2,
    marginBottom: 9,
  },
  descricao: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 10,
    lineHeight: 15,
    color: '#888888',
    marginTop: 3,
  },
  estadoCarregamento: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mensagemEstado: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#777777',
    marginTop: 10,
  },
  mensagemErro: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#B42318',
    backgroundColor: '#FDE8E7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  // Campo para o nome personalizado do protótipo.
  entradaTexto: {
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F5F6F5',
    borderWidth: 1,
    borderColor: '#E9ECE9',
    paddingHorizontal: 13,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#202820',
  },

  // Campos numéricos para limites de atenção e críticos.
  limitesLinha: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: 7,
  },
  campoLimite: {
    flex: 1,
    marginHorizontal: 5,
  },
  limiteEntradaLinha: {
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    backgroundColor: '#F5F6F5',
    borderWidth: 1,
    borderColor: '#E9ECE9',
    paddingHorizontal: 11,
  },
  limiteEntrada: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#202820',
  },
  unidadeCampo: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#777777',
  },
  dicaRecomendacao: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 9,
    color: '#999999',
    marginTop: 5,
  },
  // Separadores e opções de unidade e período.
  divisor: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 11,
  },
  opcoesLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 4,
  },
  opcao: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 11,
    backgroundColor: '#F4F5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoAtiva: {
    backgroundColor: '#249057',
  },
  opcaoTexto: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#6B7280',
  },
  opcaoTextoAtivo: {
    color: '#FFFFFF',
  },

  // Ação para persistir as configurações na API.
  botaoSalvar: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#249057',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  botaoSalvarDesativado: {
    opacity: 0.7,
  },
  botaoSalvarTexto: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
});

export default styles;
