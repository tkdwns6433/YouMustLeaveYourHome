import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button  } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SetDestination from './SetDestination.js';

const appNavigator = createStackNavigator({
  SetDestination : SetDestination,
});

const app = createAppContainer(appNavigator);

export default app;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput : { 
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1,
  },
});
