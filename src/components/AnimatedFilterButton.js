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

import Layout from "../constants/Layout"


export default class AnimatedFilterButton extends React.PureComponent {
  state = {
    width: new Animated.Value(45),
    opened: false,
    selected: {
      "trashcan": true,
      "restroom": false,
    },
    trashcanSelected: true,
    restroomSelected: false,
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


  render() {
    const opacity = {
      opacity: this.state.width.interpolate({
        inputRange: [45, 200, 300],
        outputRange: [0, 0.5, 1],
        extrapolate: "clamp"
      })
    }
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
    return (
      <View>
        <TouchableOpacity
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
            <AnimatedTouchable
              style={[styles.button]}
              activeOpacity={0.7}
              onPress={() => { this.updateWidth(!this.state.opened) }}
            >
              <MaterialCommunityIcons
                name={this.state.opened ? "filter" : "filter-outline"}
                size={32}
                color={Colors.buttonColor}
                style={{ paddingTop: 5 }}
              />

            </AnimatedTouchable>
            {/* {this.state.opened ? */}
            <TouchableOpacity
              onPress={() => {
                this.setState((prevState) => ({
                  trashcanSelected: !prevState.trashcanSelected
                }))
                this.props.onPress("trashcan", this.state.trashcanSelected)
              }}
              style={{ marginRight: 6 }}
            >
              <Animated.Image
                source={this.state.trashcanSelected ? trashcanSelected : trashcanUnselected}
                style={[{ width: 26 }, opacity]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState((prevState) => ({
                  restroomSelected: !prevState.restroomSelected
                }))
                this.props.onPress("restroom", this.state.restroomSelected)
              }}
            >
              <Animated.Image
                source={this.state.restroomSelected ? restroomSelected : restroomUnselected}
                style={[{ width: 28 }, opacity]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {/* : null} */}
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  }
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