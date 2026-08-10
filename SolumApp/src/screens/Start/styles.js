import { StyleSheet } from "react-native";

//Colocando as fontes
export const fontNames = {
  regular: 'PlusJakarta-Regular',
  bold: 'PlusJakarta-Bold',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  logo: {
    position: 'absolute',
    width: 200,
    height: 150,
    top: 50,

  },
  titulo: {
    position: 'absolute',
    fontSize: 24,
    fontFamily: fontNames.bold,
    top: 210,
  },
  subtitulo: {
    fontSize: 15,
    fontFamily: fontNames.bold,
    left: 15,
    top: 10,
  },
  container2: {
    flexDirection: 'row',
    gap: 60,
    position: 'absolute',
    top: 280,
  },
  container3: {
    position: 'absolute',
    gap: 15,
    top: 370,
  },
  container4: {
    flexDirection: 'row',
    gap: 5,
    position: 'absolute',
    top: 700,
  },
  button: {
    backgroundColor: '#e2e2e2',
    borderRadius: 90,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#249057',
  },
  button2: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  buttonText: {
    color: '#000000',
    fontFamily: fontNames.bold,
  },
  buttonText2: {
    color: '#E1E6E2',
    fontFamily: fontNames.bold,
    fontSize: 30,
  },
  input: {
    width: 350,
    height: 50,
    borderRadius: 90,
    marginBottom: 0,
    backgroundColor: '#e2e2e2',
    paddingInlineStart: 20,
  },
  gradiente: {
    borderRadius: 25,
    top: 25,
  },
  rodape: {
    fontFamily: fontNames.regular,
  },
  rodape2: {
    fontFamily: fontNames.bold,
    color: '#0F760A',
    top: -0.5,
  }
});