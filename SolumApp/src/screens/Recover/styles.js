import { StyleSheet } from 'react-native';

export const fontNames = {
  regular: 'PlusJakarta-Regular',
  bold: 'PlusJakarta-Bold',
};

export default StyleSheet.create({
  keyboard: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',

    alignItems: 'center',

    paddingHorizontal: 20,
  },

  /*
   * CONTEÚDO PRINCIPAL
   */
  content: {
    width: '100%',
    maxWidth: 400,

    alignItems: 'center',

    paddingTop: 125,
  },

  /*
   * LOGO
   */
  logo: {
    width: 170,
    height: 180,

    marginBottom: 15,
  },

  /*
   * INFORMAÇÕES DO EMAIL
   */
  emailInfo: {
    width: '100%',

    alignItems: 'center',

    gap: 8,

    marginBottom: 60,
  },

  subtitulo: {
    fontSize: 15,

    fontFamily: fontNames.bold,

    textAlign: 'center',
  },

  /*
   * FORMULÁRIO
   */
  container3: {
    width: '100%',

    alignItems: 'center',
  },

  inputGroup: {
    width: '100%',

    alignItems: 'center',

    marginBottom: 55,
  },

  /*
   * TÍTULO DO CÓDIGO
   */
  codeTitle: {
    fontSize: 15,

    fontFamily: fontNames.bold,

    textAlign: 'center',

    marginBottom: 25,
  },

  /*
   * CAMPOS DO CÓDIGO
   */
  codeContainer: {
    width: '100%',

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    gap: 20,
  },

  input: {
    width: 47,
    height: 58,

    borderRadius: 15,

    backgroundColor: '#e2e2e2',

    textAlign: 'center',

    fontSize: 24,

    fontFamily: fontNames.bold,

    color: '#000',

    padding: 0,
  },

  /*
   * BOTÃO
   */
  gradiente: {
    width: '100%',
    height: 63,

    borderRadius: 25,

    overflow: 'hidden',
  },

  button2: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText2: {
    color: '#E1E6E2',

    fontFamily: fontNames.bold,

    fontSize: 24,
  },
  backButton: {
  width: '100%',
  height: 55,

  marginTop: 12,

  justifyContent: 'center',
  alignItems: 'center',
},

backButtonText: {
  fontSize: 16,

  fontFamily: fontNames.bold,

  color: '#249057',
},
});