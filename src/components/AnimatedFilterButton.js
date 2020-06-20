import React, { useState } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Colors from "../constants/Colors";
import trashcanUnselected from "../../assets/images/trashcan-x.png";
import trashcanSelected from "../../assets/images/trashcan-o.png";
import restroomUnselected from "../../assets/images/wc-x.png";
import restroomSelected from "../../assets/images/wc-o.png";
import atmSelected from "../../assets/images/atm-o.png";
import atmUnselected from "../../assets/images/atm-x.png";
import vmUnselected from "../../assets/images/vm-x.png";
import vmSelected from "../../assets/images/vm-o.png";
import bikeUnselected from "../../assets/images/bike-x.png";
import bikeSelected from "../../assets/images/bike-o.png";
import FilterPopupPicker from "../components/FilterPopupPicker";

import Layout from "../constants/Layout"
import { Picker } from '@react-native-community/picker';


export default class AnimatedFilterButton extends React.PureComponent {
  state = {
    width: new Animated.Value(45),
    opened: false,
    // selected: {
    //   "trashcan": true,
    //   "restroom": false,
    //   "atm": false,
    // },
    modalOpened: false,
  };

  updateWidth = (open) => {
    Animated.timing(this.state.width, {
      toValue: open ? 240 : 45,
      duration: 500,
      useNativeDriver: false,
    }).start(
      this.setState({
        opened: open ? true : false,
      })
    );
  };

  render() {
    const opacity = {
      opacity: this.state.width.interpolate({
        inputRange: [45, 220, 240],
        outputRange: [0, 0.5, 1],
        extrapolate: "clamp"
      })
    }

    const items = ["trashcan", "restroom", "atm", "vm", "bike"];
    return (
      <View>
        <TouchableWithoutFeedback
          disabled={!this.state.opened}
          style={
            styles.absolute
          }
          onPress={() => {
            this.setState({ opened: false })
            this.updateWidth(false)
          }}
        >
          <Animated.View style={[styles.buttonContainer, { width: this.state.width }]}>
            <TouchableOpacity
              style={[styles.button]}
              activeOpacity={0.7}
              onPress={() => { this.updateWidth(!this.state.opened) }}
            >
              <MaterialCommunityIcons
                name={this.state.opened ? "filter-outline" : "filter"}
                size={32}
                color={Colors.buttonColor}
                style={{ paddingTop: 5, paddingRight: 2 }}
              />

            </TouchableOpacity>
            {/* {this.state.opened ? */}
            {items.map(item => {
              return <FilterButton
                item={item}
                selected={this.props.selected}
                opacity={opacity}
                updateSelected={(item) => {
                  this.props.onPress(item)
                }}
                openModal={() => { this.setState({ modalOpened: true }) }}
              />
            })}
            {/* : null} */}
          </Animated.View>

        </TouchableWithoutFeedback>
        <FilterPopupPicker
          opened={this.state.modalOpened}
          setOpened={(toUpdate) => { this.setState({ modalOpened: toUpdate }) }}
          updateSelected={(item) => {
            this.props.onPress(item)
          }}
          updateFilterBank={toUpdate => { this.props.updateFilterBank(toUpdate) }}
        />

      </View>
    )
  }
}

function FilterButton({ selected, updateSelected, item, opacity, openModal }) {
  const icon = {
    "trashcan": [trashcanSelected, trashcanUnselected, 2, 26],
    "restroom": [restroomSelected, restroomUnselected, 10, 28],
    "atm": [atmSelected, atmUnselected, 12, 24],
    "vm": [vmSelected, vmUnselected, 12, 22],
    "bike": [bikeSelected, bikeUnselected, 12, 28]
  }

  return (
    <TouchableOpacity
      onPress={() => {
        item == "atm" ? openModal() : updateSelected(item)
      }}
      style={{ marginLeft: icon[item][2] }}
    >
      <Animated.Image
        source={item == selected ? icon[item][0] : icon[item][1]}
        style={[{ width: icon[item][3] }, opacity]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    right: 20,
    bottom: 160,
    height: 45,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 7,
    borderColor: Colors.buttonBorderColor,
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",

    //height: 45,
    width: 45,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  },
})