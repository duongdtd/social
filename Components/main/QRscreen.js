import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

// See the README file
import SvgQRCode from 'react-native-qrcode-svg';

// Simple usage, defaults for all but the value
export default function QRscreen(props) {
    
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <SvgQRCode value={"hello/////"+props.route.params.data} size={250}/>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
});
