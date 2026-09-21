import { StyleSheet } from 'react-native';

export const fontNames = {
  regular: 'PlusJakarta-Regular',
  bold: 'PlusJakarta-Bold',
};

export default StyleSheet.create({

  /*
   * CONTAINER
   */
  container: {
    flex: 1,

    backgroundColor: '#f0f0f0',

    paddingHorizontal: 20,
  },


  /*
   * CONTA
   */
  header: {
    width: '100%',

    marginTop: 25,
    marginBottom: 25,
  },

  ola: {
    fontSize: 16,

    fontFamily: fontNames.regular,

    color: '#555555',
  },

  nomeConta: {
    fontSize: 26,

    fontFamily: fontNames.bold,

    color: '#000000',

    marginTop: 2,
  },


  /*
   * SEÇÕES
   */
  section: {
    width: '100%',

    marginBottom: 25,
  },

  tituloSecao: {
    fontSize: 20,

    fontFamily: fontNames.bold,

    color: '#000000',
  },


  /*
   * ALERTAS
   */
 alertCard: {
  width: '100%',

  height: 70,

  backgroundColor: '#FFF0D9',

  borderRadius: 20,

  paddingHorizontal: 20,

  justifyContent: 'center',

  borderLeftWidth: 4,
  borderLeftColor: '#F59E0B',

  marginTop: 12,
},

  alertText: {
    fontSize: 14,

    fontFamily: fontNames.regular,

    color: '#444444',
  },


  /*
   * SEÇÃO DE FAZENDAS
   */
  fazendasSection: {
    width: '100%',

    flex: 1,

    marginBottom: 100,
  },


  /*
   * TÍTULO + BOTÃO
   */
  fazendasHeader: {
    width: '100%',

    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 12,
  },


  /*
   * BOTÃO CRIAR FAZENDA
   */
  criarButton: {
    backgroundColor: '#249057',

    borderRadius: 90,

    paddingHorizontal: 15,
    paddingVertical: 9,

    justifyContent: 'center',
    alignItems: 'center',
  },

  criarButtonText: {
    color: '#ffffff',

    fontSize: 13,

    fontFamily: fontNames.bold,
  },


  /*
   * CAIXA DAS FAZENDAS
   */
  fazendasBox: {
    width: '100%',

    flex: 1,

    backgroundColor: '#e2e2e2',

    borderRadius: 20,

    padding: 12,
  },

  fazendasList: {
    paddingBottom: 5,
  },


  /*
   * CARD DA FAZENDA
   */
  fazendaCard: {
    width: '100%',

    height: 65,

    backgroundColor: '#ffffff',

    borderRadius: 16,

    paddingHorizontal: 18,

    justifyContent: 'center',

    marginBottom: 10,

    borderBottomWidth: 3,
    borderBottomColor: '#249057',
  },

  fazendaNome: {
    fontSize: 15,

    fontFamily: fontNames.bold,

    color: '#000000',
  },


  /*
   * NENHUMA FAZENDA
   */
  emptyContainer: {
    width: '100%',

    flex: 1,

    backgroundColor: '#e2e2e2',

    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 25,
  },

  emptyText: {
    fontSize: 15,

    fontFamily: fontNames.bold,

    color: '#333333',

    textAlign: 'center',
  },

  emptySubtext: {
    fontSize: 13,

    fontFamily: fontNames.regular,

    color: '#666666',

    textAlign: 'center',

    marginTop: 6,
  },

});