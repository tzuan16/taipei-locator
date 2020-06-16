import React from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import MapView, { Marker } from 'react-native-maps';
//import MapView from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

import trashcanIcon from "../../assets/images/delete.png";
import trashcanData from "../../assets/data/trashcans.json";
import restroomData from "../../assets/data/restrooms.json";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import RestroomMarker from "../components/RestroomMarker";
import TrashcanMarker from "../components/TrashcanMarker";
import AnimatedFilterButton from "../components/AnimatedFilterButton";


import loadingMask from "../../assets/images/find.png"

//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
export default class MapScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingProgress: new Animated.Value(0),
      animationDone: false,
      initialRegion: null,
      isMapReady: false,
      data: [],
      icon: null,
      currentMarker: null,
      chosenIcons: ["trashcan"],
    }
    console.log("project started")
  }

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let region = {
          latitude: parseFloat(position.coords.latitude),
          longitude: parseFloat(position.coords.longitude),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }
        this.setState({
          initialRegion: region,
          loadedUserLocation: true,
        })
        console.log("got location")

      },
      error => console.log(error),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 1000,
      }
    )
  }

  componentDidMount() {
    this.getCurrentLocation();
    console.log("componentDidMount")

  }

  loadRestrooms = () => {
    console.log("loadingRestrooms")
    return restroomData.ToiletData.map((data, i) =>
      <RestroomMarker data={data} index={i} />
    )
  }

  loadTrashcans = () => {
    console.log("loadingTrashcans")
    return trashcanData.map((data) =>
      <TrashcanMarker data={data} />
    )
  }

  updateChosenIcons = (toUpdate, exist) => {
    // The toUpdate item exists in current state array
    // Should remove it
    console.log("update: " + exist)
    this.setState(prevState => ({
      chosenIcons: exist ?
        prevState.chosenIcons.filter(item => { item !== toUpdate }) :
        prevState.chosenIcons.concat(toUpdate)
    }
    ))

  }

  render() {
    console.log("render")
    const { navigation } = this.props;
    const colorLayer = this.state.animationDone ? null : <View style={[StyleSheet.absoluteFill, { backgroundColor: "blue" }]} />;
    const whiteLayer = this.state.isMapReady ? null : <View style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]} />;
    const imageScale = {
      transform: [
        {
          scale: this.state.loadingProgress.interpolate({
            inputRange: [0, 15, 100],
            outputRange: [0.1, 0.06, 16],
          })
        }
      ]
    }

    const opacity = {
      opacity: this.state.loadingProgress.interpolate({
        inputRange: [0, 25, 50],
        outputRange: [0, 0, 1],
        extrapolate: "clamp"
      })
    }

    // if (this.state.isMapReady && !this.state.animationDone) {
    //   console.log("animation start")

    //   Animated.timing(this.state.loadingProgress, {
    //     toValue: 100,
    //     duration: 3000,
    //     useNativeDriver: true,
    //     delay: 400,
    //   }).start(() => {
    //     this.setState({
    //       animationDone: true
    //     })

    //   })
    // }

    const renderIconFunctions = {
      "restroom": this.loadRestrooms,
      "trashcan": this.loadTrashcans,
    };

    return (
      <View style={{ flex: 1 }}>
        {/* {colorLayer}
        <MaskedView
          style={{ flex: 1 }}
          maskElement={
            <View style={styles.centeredContainer}>
              <Animated.Image
                source={loadingMask}
                style={[{ width: 1000 }, imageScale]}
                resizeMode="contain"
              />
            </View>
          }
        >

          
          <Animated.View style={[styles.mapContainer, opacity]}> */}

        <MapView
          style={styles.mapStyle}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          initialRegion={this.state.initialRegion}
          ref={(map) => { this.map = map }}
          onMapReady={() => { this.setState({ isMapReady: true }); console.log("map ready") }}
        >
          {this.state.chosenIcons.map(icon => {
            return renderIconFunctions[icon]();
          })}
        </MapView>
        <View style={styles.openDrawerButtonContainer}>
          <MaterialCommunityIcons.Button
            name="menu"
            onPress={navigation.openDrawer}
            backgroundColor="rgba(0,0,0,0.2)"
            size={36}
            iconStyle={styles.openDrawerButton}
          />
        </View>

        <View style={styles.showUserLocationButtonContainer}>
          <TouchableOpacity
            style={[styles.showUserLocationButton, styles.centered]}
            activeOpacity={0.7}
            onPress={() => this.map.animateToRegion(this.state.initialRegion, 1500)}
          >
            <FontAwesome5
              name="location-arrow"
              size={26}
              color={Colors.buttonColor}
              style={{ paddingTop: 0 }}
            />
          </TouchableOpacity>
        </View>
        <AnimatedFilterButton
          onPress={(toUpdate, exist) => this.updateChosenIcons(toUpdate, exist)}
        />
        {whiteLayer}
        {/* </Animated.View>

        </MaskedView> */}
      </View>
    )

  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapStyle: {
    width: Layout.window.width,
    height: Layout.window.height,
  },
  calloutContainer: {

  },
  calloutTextTitle: {
    fontSize: 15,
    paddingBottom: 5,
  },
  calloutTextStrong: {
    paddingLeft: 2, fontSize: 10, fontWeight: "900",
  },
  openDrawerButtonContainer: {
    position: "absolute",
    left: 20,
    top: 50,
  },
  openDrawerButton: {
    marginRight: 0,
    marginVertical: -5
  },
  showUserLocationButtonContainer: {
    position: "absolute",
    right: 20,
    bottom: 100,
  },
  showUserLocationButton: {
    backgroundColor: "#fff",
    height: 45,
    width: 45,
    borderWidth: 2,
    borderRadius: 7,
    borderColor: Colors.buttonBorderColor,
  }
});
