import UserBase from "./UserBase";
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   FlatList,
//   TextInput,
// } from "react-native";
// import React, { useState } from "react";

export default class Worker extends UserBase {
  constructor(name,last_name, email, phone, role) {
    super(name, last_name, email, phone, 1); // Tipo de usuario 1 para Trabajador
    // New attributes
    this._createdAt = new Date();
    this._completedTasks = [];
    this._negativeOpinions = [];
    this._isWorking = false;
    this._role = role;
  }

  getWorkerRole(){
    return this._role;
  }

  getCreatedAt(){
    return this._createdAt;
  }

  //Método para manejar el cambio de texto
  manejarCambioTexto(nuevoTexto) {
    this.setTexto(nuevoTexto);
  }

  // Getter y Setter para completedTasks y negativeOpinions
  getCompletedTasks() {
    return this._completedTasks;
  }

  setCompletedTasks(labores) {
    if (Array.isArray(labores)) {
      this._completedTasks = labores;
    } else {
      throw new Error("Las labores completadas deben ser un array.");
    }
  }

  negativeOpinions() {
    return this._negativeOpinions;
  }

  negativeOpinions(opiniones) {
    if (Array.isArray(opiniones)) {
      this._negativeOpinions = opiniones;
    } else {
      throw new Error("Las opiniones deben ser un array.");
    }
  }

  // Método para agregar una labor a la lista de labores completadas
  addTask(labor) {
    this._completedTasks.push(labor);
  }

  // Método para eliminar una opinión de la lista negra
  eliminarElemento(index) {
    if (index >= 0 && index < this._negativeOpinions.length) {
      const elemento = this._negativeOpinions.splice(index, 1)[0];
      this._completedTasks.push(elemento);
      console.log("Se ha marcado como completado el baño correspondiente");
    } else {
      console.log("Índice fuera de rango");
    }
  }

  // Getter y Setter para isWorking
  isWorking() {
    return this._isWorking;
  }

  isWorking(value) {
    if (typeof value === "boolean") {
      this._isWorking = value;
    } else {
      throw new Error("El estado de trabajo debe ser un valor booleano.");
    }
  }

  // Metodos de renderizacion faltantes
}
