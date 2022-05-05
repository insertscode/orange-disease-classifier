import { StyleSheet, Dimensions } from 'react-native';

const {height, width} = Dimensions.get('window');
const fonts = { Bold: {fontFamily: 'Roboto-Bold'} };

const styles = StyleSheet.create({
    outmost: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      ...fonts.Bold,    
    },
    title: {
      alignSelf: 'center',
      position: 'absolute',
      top: 15,
      fontSize: 34,
      color: '#FFF',
    },
    btn: {
      position: 'absolute',
      bottom: 40,
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    btnStyle: {
      backgroundColor: '#FFF',
      opacity: 0.8,
      marginHorizontal: 30,
      padding: 20,
      borderRadius: 20,
    },
    imageIcon: {
        height: 40, 
        width: 40, 
        tintColor: '#000'
    },
    imageStyle: {
      marginBottom: 50,
      width: width / 1.5,
      height: width / 1.5,
      borderRadius: 20,
      position: 'absolute',
      borderWidth: 1,
      borderColor: '#FFF',
      top: height / 5,
    },
    predictionTextContainer: {
        flexDirection: 'row', 
        position: 'absolute', 
        top: height/1.65
    },
    postPredictionText: {
        width: 'auto', 
        padding: 2, 
        backgroundColor: '#CD7F32', 
        textAlign: 'center', 
        fontSize: 20, 
        marginVertical: 10, 
        marginHorizontal: 10
    },      
    predictionTextHeader: {
        fontSize: 28, 
        color: '#FFF', 
        textDecorationLine: 'underline'
    },  
    noPredictionText: {
        position: 'absolute', 
        top: height/1.65, 
        maxWidth: '70%', 
        width: 'auto', 
        backgroundColor: '#CD7F32', 
        borderRadius: 4,
        textAlign: 'center', 
        fontSize: 20,
        color: '#FFF', 
        marginVertical: 10, 
        marginHorizontal: 10,
        padding: 2,
    },
});

export { styles, fonts, height, width };

