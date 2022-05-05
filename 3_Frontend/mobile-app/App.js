import React, { useState } from 'react';
import { Image, StatusBar, Text, Platform, useColorScheme, View, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import PermissionsService, {isIOS} from './Permissions';
import { styles, fonts, height, width } from './Styles';

axios.interceptors.request.use(
  async config => {
    let request = config;
    request.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    request.url = configureUrl(config.url);
    return request;
  },
  error => error,
);

const configureUrl = url => {
  let authUrl = url;
  if (url && url[url.length - 1] === '/') {
    authUrl = url.substring(0, url.length - 1);
  }
  return authUrl;
};

const imgProperties = {
  mediaType: 'photo',
  quality: 1,
  width: 256,
  height: 256,
  includeBase64: true,
};

const App = () => {
  const [result, setResult] = useState('');
  const [label, setLabel] = useState('');
  const [image, setImage] = useState('welcome');
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter };

  const getPredication = async params => {
    return new Promise((resolve, reject) => {
      var bodyFormData = new FormData();
      bodyFormData.append('file', params);
      return axios
        .post(Config.URL, bodyFormData)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          setLabel('Prediction failed.');
          reject('err', error);
        });
    });
  };

  const getImage = async type => {
    try {
      if (type === 'Camera') {
        if (!(await PermissionsService.hasCameraPermission())) return [];
        else getter(launchCamera);
      } else { 
        if (!(await PermissionsService.hasPhotoPermission())) return [];
        getter(launchImageLibrary);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getter = async (func) => {
    func(imgProperties, async response => {
      if (response.didCancel) console.log('User cancelled image picker');
      else if (response.error) console.log('ImagePicker Error: ', response.error);
      else if (response.customButton) console.log('User tapped custom button: ', response.customButton);
      else {
        const uri = response?.assets[0]?.uri;
        const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
        getResult(path, response);
      }
    });
  };

  const clearOutput = () => {
    setResult('');
    setImage('');
  };

  const getResult = async (path, response) => {
    setImage(path);
    setResult('');
    setLabel('Predicting...');
    const params = { uri: path, name: response.assets[0].fileName, type: response.assets[0].type };
    const res = await getPredication(params);
    if (res.data.confidence > 65.00){
      setLabel(res.data.class);
      setResult(res.data.confidence);
    } else {
      setLabel('Failed to make a prediction.');
    }
  };

  return (
    <View style={[backgroundStyle, styles.outmost]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ImageBackground blurRadius={5} source={{uri: 'background'}} style={{height: height, width: width}}/>
      <Text style={styles.title}>{'Orange Disease \n Prediction App'}</Text>
      {
          (image?.length && <Image source={{uri: image}} style={styles.imageStyle}/>) 
          || 
          null
      }
      {
        (result && label && (
          <View style={styles.predictionTextContainer}>
            <Text style={styles.postPredictionText}>
              <Text style={styles.predictionTextHeader}>{'Prediction \n'}</Text>
              <Text style={{color:'#FFF'}}>{label}</Text>
            </Text>
            <Text style={styles.postPredictionText}>
              <Text style={styles.predictionTextHeader}>{'Confidence \n'}</Text>
              <Text style={{color:'#FFF'}}>{result + '%'}</Text>
            </Text>
          </View>)
        )
        || ( image && image != 'welcome' && <Text style={styles.noPredictionText}>{label}</Text>)
        || (<Text style={styles.noPredictionText}>{'Upload an Orange fruit or leaf image for disease prediction.'}</Text>)
      }
      <View style={styles.btn}>
        <TouchableOpacity  onPress={() => getImage('Camera')} style={styles.btnStyle}>
          <View>
            <Image source={{uri: 'camera'}} style={styles.imageIcon} />
            <Text>Snap it</Text> 
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => getImage('Photo')} style={styles.btnStyle}>
          <View>
            <Image source={{uri: 'gallery'}} style={styles.imageIcon} />
            <Text>Upload</Text> 
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearOutput} style={styles.btnStyle}>
          <View>
            <Image source={{uri: 'clean'}} style={styles.imageIcon}/>
            <Text>Clear</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { configureUrl }
export default App;
