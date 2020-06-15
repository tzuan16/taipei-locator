import React from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import MapView, { Marker } from 'react-native-maps';
//import MapView from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
import Layout from "../constants/Layout";
import trashcanIcon from "../../assets/images/delete.png";
import trashcanData from "../../assets/data/trashcans.json";
import restroomData from "../../assets/data/restrooms.json";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import RestroomMarker from "../components/RestroomMarker";
import TrashcanMarker from "../components/TrashcanMarker";


import loadingMask from "../../assets/images/find.png"

//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
export default class MapScreen extends React.PureComponent {
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
          region={this.state.initialRegion}
          //initialRegion={{ longitude: 122, latitude: 25.5, longitudeDelta: 0.01, latitudeDelta: 0.01 }}
          ref={(map) => { this.map = map }}
          onMapReady={() => { this.setState({ isMapReady: true }); console.log("map ready") }}
        >
          {this.loadRestrooms()}
          {this.loadTrashcans()}

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
          <FontAwesome5.Button
            name="location-arrow"
            onPress={() => this.map.animateToRegion(this.state.initialRegion, 1500)}
            backgroundColor="#fff"
            size={26}
            iconStyle={styles.showUserLocationButton}
          />
        </View>
        {whiteLayer}
        {/* </Animated.View>

        </MaskedView> */}
      </View>
    )

  }
}

const styles = StyleSheet.create({
  centeredContainer: {
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
    //borderWidth: 2
  },
  showUserLocationButton: {
    marginRight: 0,
    //marginVertical: -5,
    color: "#3399ff",
  }
});
