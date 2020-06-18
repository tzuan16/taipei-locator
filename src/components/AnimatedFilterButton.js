import React from 'react';
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


import Layout from "../constants/Layout"


export default class AnimatedFilterButton extends React.PureComponent {
  state = {
    width: new Animated.Value(45),
    opened: false,
    // selected: {
    //   "trashcan": true,
    //   "restroom": false,
    //   "atm": false,
    // },
    selected: "trashcan"
  };

  updateWidth = (open) => {
    Animated.timing(this.state.width, {
      toValue: open ? 300 : 45,
      duration: 500,
      useNativeDriver: false,
    }).start(
      this.setState({
        opened: open ? true : false,
      })
    );
  };

  updateSelected = (item) => {
    this.setState(prevState => (
      {
        //selected: { ...this.state.selected, [item]: !prevState.selected[item] }
        selected: item
      }))
  }

  render() {
    const opacity = {
      opacity: this.state.width.interpolate({
        inputRange: [45, 200, 300],
        outputRange: [0, 0.5, 1],
        extrapolate: "clamp"
      })
    }

    const items = ["trashcan", "restroom", "atm"];

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
                style={{ paddingTop: 5 }}
              />

            </TouchableOpacity>
            {/* {this.state.opened ? */}
            {items.map(item => {
              return <FilterButton
                item={item}
                selected={this.state.selected}
                opacity={opacity}
                updateSelected={(item) => {
                  this.updateSelected(item)
                  this.props.onPress(item)
                }}
              />
            })}
            {/* : null} */}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

function FilterButton({ selected, updateSelected, item, opacity }) {
  const icon = {
    "trashcan": [trashcanSelected, trashcanUnselected, 2, 26],
    "restroom": [restroomSelected, restroomUnselected, 10, 28],
    "atm": [atmSelected, atmUnselected, 12, 24]
  }

  return (
    <TouchableOpacity
      onPress={() => {
        updateSelected(item)
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