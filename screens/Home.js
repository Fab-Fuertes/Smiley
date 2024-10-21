import { Text, StyleSheet, View, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import DataDisplay from './DataDisplay'

export default function Inicio() {

    return (
      <ScrollView>
        <Text>Bienvenido</Text>
        <DataDisplay />
      </ScrollView>
    )
}

const styles = StyleSheet.create({})