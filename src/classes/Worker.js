import User from "./User";
// import serveur from "./serveur";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import React, { useState } from "react";

export default class Worker extends User {
  constructor(name, email, password) {
    super(name, email, password, 1); // Establece tipoUsuario en 1 para Trabajador
    this._completedTasks = []; // Lista para almacenar labores completadas
    this._negativeOpinions = []; // Lista de las opiniones negativas
    this._isWorking = false; // Indica si está trabajando o no
  }
  //Método para manejar el cambio de texto
  manejarCambioTexto(nuevoTexto) {
    setTexto(nuevoTexto);
  }

  // Getter y Setter para laboresCompletadas y opiniones negativas
  get completedTasks() {
    return this._completedTasks;
  }

  set completedTasks(labores) {
    if (Array.isArray(labores)) {
      this._completedTasks = labores;
    } else {
      throw new Error("Las labores completadas deben ser un array.");
    }
  }

  get negativeOpinions() {
    return this._negativeOpinions;
  }

  set negativeOpinions(opiniones) {
    if (Array.isArray(opiniones)) {
      this._negativeOpinions = opiniones;
    } else {
      throw new Error("Las opiniones completadas deben ser un array.");
    }
  }
  // Método para agregar una labor a la lista de labores completadas
  addTask(labor) {
    this._completedTasks.push(labor);
  }
  // Metodo para eliminar una opinion de la lista negra
  eliminarElemento(texto) {
    {
      this._negativeOpinions.map((elemento, index) => (
        <Text key={index} style={styles.item}>
          {elemento}
        </Text>
      ));
    }
    if (texto === elemento.id) {
      this._completedTasks.push(elemento);
      this._negativeOpinions.pop(elemento);
    }
    const mensaje = "Se ha marcado como completado el baño correspondiente";
    console.log(mensaje);
  }
  // Getter y Setter para estaTrabajando
  get isWorking() {
    return this._isWorking;
  }

  set isWorking(value) {
    if (typeof value === "boolean") {
      this._isWorking = value;
    } else {
      throw new Error("El estado de trabajo debe ser un valor booleano.");
    }
  }

  //Hace falta revisar esto
  ///return(
  //<View style={styles.container}>
  //<TextInput
  //style={styles.input}
  //placeholder="Por favor, ingrese el ID del baño que fue atendido..."
  //value={texto}
  //onChangeText={manejarCambioTexto}
  ///>
  //<FlatList
  //data={this._negativeOpinions}
  //keyExtractor={(item, index) => index.toString()}
  //renderItem={({ item, index }) => (
  //<View style={styles.item}>
  //<Text>{item}</Text>
  //<Button title="Eliminar" onPress={() => eliminarElemento(index)} />
  //</View>
  ///)}
  ///>
  //</View>
  //);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "80%",
  },
  item: {
    marginVertical: 10,
  },
});
