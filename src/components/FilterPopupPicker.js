import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
import { Picker } from "@react-native-community/picker";
import Layout from "../constants/Layout";
import banks from "../../assets/data/banks.json";
import Colors from "../constants/Colors";

export default function FilterPopupPicker({ opened, setOpened, updateSelected, updateFilterBank, children }) {
  const [bank, setBank] = useState("all")
  return (
    <View style={styles.container}>
      <Modal
        isVisible={opened}
        style={styles.modal}
      >
        <View style={styles.contentContainer}>
          <Picker
            selectedValue={bank}
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: 15,
            }}
            onValueChange={(itemValue) => { setBank(itemValue) }}

          >
            <Picker.Item label="全部顯示" value="all" />
            {banks.map(bank => {
              return <Picker.Item label={("00" + bank.code).slice(-3) + bank.bank} value={bank.code} />
            })}
          </Picker>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => { setOpened(false) }}
              style={styles.button}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOpened(false)
                updateSelected("atm")
                updateFilterBank(bank)
              }}
              style={styles.button}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>確認</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300
  },
  modal: {
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: Platform.OS == "ios" ? "10%" : "20%",
    marginVertical: Platform.OS == "ios" ? (Layout.window.height - 320) / 2 : (Layout.window.height - 170) / 2,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.theme,
  },
  contentContainer: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  button: {
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#505050",
    padding: 5,
    backgroundColor: "#e0e0e0"
  }
})