import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';

const UmbralConfig = ({ terminalId, refreshData }) => { // Añadir refreshData como prop
  const updateDynamicThreshold = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/update-dynamic-threshold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la actualización: ${response.status}`);
      }

      const result = await response.json();
      Alert.alert(result.message);
      refreshData(); // Llamar a refreshData después de la actualización
    } catch (error) {
      console.error('Error actualizando umbral dinámico:', error);
      Alert.alert('Error actualizando umbral dinámico');
    }
  };

  return (
    <View>
      <Button title="Actualizar Umbral Dinámicamente" onPress={updateDynamicThreshold} />
    </View>
  );
};

export default UmbralConfig;