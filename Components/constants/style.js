import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create ({
	container: {
		flex:1,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#ffffff',
	},
	input: {
		padding: 10,
		borderWidth:1,
		borderColor: '#ccc',
		width:'80%',
		marginBottom:10,
		borderRadius:5
	},
	btnText: {
		color:'darkblue',
		fontSize:20
	},
	inputSearch: {
		height:36,
		borderWidth:1,
		marginTop:15,
		borderRadius:3,
		padding:6
	}
});

export default styles
