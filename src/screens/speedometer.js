import React, { Component, useState, useEffect } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import RNSpeedometer from "react-native-speedometer";

export default class Speedometer extends Component {
  state = {
    value: 0,
  };
  onChange = (value) => this.setState({ value: parseInt(value) });

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Speedometer Value"
          style={styles.textInput}
          onChangeText={this.onChange}
        />
        <RNSpeedometer
          value={this.state.value}
          size={200}
          minValue={0}
          maxValue={100}
          labels={[
            {
              name: "Opiniones excelentes",
              labelColor: "#00ff6b",
              activeBarColor: "#00ff6b",
            },
            {
              name: "Opiniones muy buenas",
              labelColor: "#14eb6e",
              activeBarColor: "#14eb6e",
            },
            {
              name: "Opiniones regulares",
              labelColor: "#f2cf1f",
              activeBarColor: "#f2cf1f",
            },
            {
              name: "Las Opiniones han desmejorado",
              labelColor: "#f4ab44",
              activeBarColor: "#f4ab44",
            },
            {
              name: "Opiniones malas",
              labelColor: "#ff5400",
              activeBarColor: "#ff5400",
            },
            {
              name: "Opiniones muy malas",
              labelColor: "#ff2900",
              activeBarColor: "#ff2900",
            },
          ]}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    borderBottomWidth: 0.3,
    borderBottomColor: "black",
    height: 25,
    fontSize: 16,
    marginVertical: 50,
    marginHorizontal: 20,
  },
});
