import { StyleSheet } from 'react-native';

export const fontNames = {
  regular: 'PlusJakarta-Regular',
  bold: 'PlusJakarta-Bold',
};

export default StyleSheet.create({

  /*
   * TECLADO
   */

  keyboard: {
    flex: 1,
  },


  /*
   * SCROLL PRINCIPAL
   */

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 110,
  },


  /*
   * CONTAINER PRINCIPAL
   */

  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 20,
    paddingVertical: 115,
  },


  /*
   * CONTEÚDO
   */

  content: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
  },


  /*
   * TÍTULO
   */

  titulo: {
    fontSize: 24,
    fontFamily: fontNames.bold,

    textAlign: 'center',

    marginBottom: 5,
    marginTop: -5,
  },


  /*
   * DESCRIÇÃO DO TÍTULO
   */

  descricaoTitulo: {
    fontSize: 14,
    fontFamily: fontNames.regular,

    color: '#555',

    textAlign: 'center',

    marginBottom: 25,
  },


  /*
   * GRUPO DOS CAMPOS
   */

  inputGroup: {
    width: '100%',

    marginBottom: 20,
  },


  /*
   * SUBTÍTULOS
   */

  subtitulo: {
    fontSize: 15,
    fontFamily: fontNames.bold,

    marginBottom: 8,
    marginLeft: 10,
  },


  /*
   * DESCRIÇÃO DO PROBLEMA
   */

  inputDescricaoGrande: {
    width: '100%',
    height: 140,

    borderRadius: 20,

    backgroundColor: '#e2e2e2',

    paddingHorizontal: 20,
    paddingVertical: 15,

    fontFamily: fontNames.regular,
    fontSize: 14,
  },


  /*
   * TIPOS DE PROBLEMA
   *
   * Ficam sempre em uma única linha.
   */

  tipoContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    paddingHorizontal: 2,
  },


  /*
   * BOTÃO DO TIPO
   */

  tipoButton: {
    backgroundColor: '#e2e2e2',

    borderRadius: 90,

    paddingHorizontal: 15,
    paddingVertical: 10,

    borderWidth: 1,
    borderColor: '#d0d0d0',

    flexShrink: 0,
  },


  /*
   * BOTÃO SELECIONADO
   */

  tipoButtonSelecionado: {
    backgroundColor: '#249057',

    borderColor: '#249057',
  },


  /*
   * TEXTO DO TIPO
   */

  tipoText: {
    fontFamily: fontNames.regular,

    fontSize: 12,

    color: '#333',

    flexShrink: 0,
  },


  /*
   * TEXTO SELECIONADO
   */

  tipoTextSelecionado: {
    fontFamily: fontNames.bold,

    color: '#ffffff',
  },


  /*
   * BOTÃO DE ANEXO
   */

  anexoButton: {
    width: '100%',
    height: 80,

    borderRadius: 20,

    backgroundColor: '#e2e2e2',

    borderWidth: 2,
    borderColor: '#249057',
    borderStyle: 'dashed',

    justifyContent: 'center',
    alignItems: 'center',

    gap: 2,
  },


  /*
   * ÍCONE DO ANEXO
   */

  anexoIcon: {
    fontSize: 24,

    fontFamily: fontNames.bold,

    color: '#249057',

    lineHeight: 25,
  },


  /*
   * TEXTO DO ANEXO
   */

  anexoText: {
    fontFamily: fontNames.regular,

    color: '#333',

    fontSize: 13,
  },


  /*
   * QUANTIDADE DE ANEXOS
   */

  anexoQuantidade: {
    fontFamily: fontNames.regular,

    fontSize: 12,

    color: '#0F760A',

    marginLeft: 10,
    marginTop: 5,
  },


  /*
   * BOTÃO ENVIAR
   */

  enviarButton: {
    width: '100%',
    height: 60,

    borderRadius: 25,

    backgroundColor: '#249057',

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 2,

    borderBottomWidth: 4,
    borderBottomColor: '#0F760A',
  },


  /*
   * TEXTO DO BOTÃO
   */

  enviarButtonText: {
    color: '#E1E6E2',

    fontFamily: fontNames.bold,

    fontSize: 18,
  },

});