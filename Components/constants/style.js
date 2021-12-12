import React from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components';

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
		height:40,
		borderWidth:2,
		marginTop:20,
		borderRadius:4,
		padding:7,
		zIndex:3
	},
	
});

export default styles
