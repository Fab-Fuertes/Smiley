import { Text, StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'

export default function CalificacionesAnteriores() {

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Reseñas</Text>
    
    <View style={styles.inputContainer}>
    </View>
  </View>
)
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
},
title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
},
inputContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
},
});