import { Text, StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import DataDisplay from './DataDisplay'

export default function Inicio() {

    return (
      <View>
        <Text>Bienvenido</Text>
        <DataDisplay />
      </View>
    )
}

const styles = StyleSheet.create({})