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
    justifyContent: 'center',

    paddingHorizontal: 20,
  },

  /*
   * CONTENT ORGANIZADO
   */
  content: {
    width: '100%',
    maxWidth: 400,
  
    alignItems: 'center',
  
    transform: [
      {
        translateY: -60,
      },
    ],
  },

  /*
   * LOGO
   */
  logo: {
    width: 170,
    height: 200,

    marginBottom: -20,
  },

  /*
   * TÍTULO
   */
  titulo: {
    fontSize: 24,

    fontFamily: fontNames.bold,

    textAlign: 'center',

    marginBottom: 25,
  },

  /*
   * FORMULÁRIO
   */
  container3: {
    width: '100%',

    gap: 12,
  },

  inputGroup: {
    width: '100%',

    gap: 5,
  },

  subtitulo: {
    fontSize: 15,

    fontFamily: fontNames.bold,

    marginLeft: 15,
  },

  input: {
    width: '100%',
    height: 45,

    borderRadius: 90,

    backgroundColor: '#e2e2e2',

    paddingHorizontal: 20,

    fontFamily: fontNames.regular,
  },

  /*
   * BOTÃO CONFIRMAR
   */
  gradiente: {
    width: '100%',
    height: 65,

    borderRadius: 25,

    marginTop: 50,

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

    fontSize: 26,
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