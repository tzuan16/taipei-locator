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

import ZoomInText from "../components/ZoomInText";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import RestroomMarkers from "../components/RestroomMarker";
import TrashcanMarkers from "../components/TrashcanMarker";
import AtmMarkers from "../components/AtmMarker";
import VMMarkers from "../components/VMMarker";
import BikeMarkers from "../components/BikeMarker";
import AnimatedFilterButton from "../components/AnimatedFilterButton";


import loadingMask from "../../assets/images/find.png"

//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
export default class MapScreen extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingProgress: new Animated.Value(0),
      animationDone: false,
      userLocation: {
        latitude: 25.025,
        longitude: 121.55,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      },
      mapRegion: {
        latitude: 25.025,
        longitude: 121.55,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      },
      isMapReady: false,
      data: [],
      icon: null,
      currentMarker: null,
      selected: "trashcan",
      iconsLoaded: false,
      atmFilterBank: "all",
      showIcons: true,
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
          userLocation: region,
          mapRegion: region,
          loadedUserLocation: true,
        })
        console.log("got location")
        if (region.longitude != null) {
          this.map.animateToRegion(this.state.userLocation, 1500)
        }
      },
      error => { console.log(error) },
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
    this.setState({ iconsLoaded: true })
  }

  componentDidUpdate(prevProp, prevState) {
    console.log("did update")
    // if (prevState.chosenIcons !== this.state.chosenIcons) {
    //   this.setState({ iconsLoaded: true })
    //   console.log("a")
    // }
  }

  updateSelected = (toUpdate) => {
    // The toUpdate item exists in current state array
    // Should remove it
    this.setState({
      // chosenIcons: exist ?
      //   prevState.chosenIcons.filter(item => item != toUpdate) :
      //   prevState.chosenIcons.concat(toUpdate),
      selected: toUpdate,
    })
  }

  updateUserLocation = (lat, lng, speed) => {
    if (speed > 1) {
      this.setState({
        userLocation: {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }
      })
    }
  }

  updateShowIcons = (region) => {
    this.setState({ mapRegion: region }, () => {
      if (this.state.showIcons && this.state.mapRegion.longitudeDelta > 0.06) {
        this.setState({
          showIcons: false,
        })
      } else if (!this.state.showIcons && this.state.mapRegion.longitudeDelta < 0.06) {
        this.setState({
          showIcons: true,
        })
      }
    })
  }

  render() {
    console.log("render")
    console.log(this.state.mapRegion)
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

    const loadingLayer = this.state.iconsLoaded ? null : <View style={[StyleSheet.absoluteFill, { backgroundColor: "black", opacity: 0.5 }]} />;

    const opacity = {
      opacity: this.state.loadingProgress.interpolate({
        inputRange: [0, 25, 50],
        outputRange: [0, 0, 1],
        extrapolate: "clamp"
      })
    }

    const renderIcons = {
      "restroom": <RestroomMarkers region={this.state.mapRegion} />,
      "trashcan": <TrashcanMarkers region={this.state.mapRegion} />,
      "atm": <AtmMarkers region={this.state.mapRegion} filter={this.state.atmFilterBank} />,
      "vm": <VMMarkers region={this.state.mapRegion} />,
      "bike": <BikeMarkers region={this.state.mapRegion} />
    };

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

    // const renderIcons = this.state.chosenIcons.map((icon, i) => {
    //   return renderIconFunctions[icon];
    // });

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
          initialRegion={this.state.userLocation}
          onRegionChangeComplete={region => { this.updateShowIcons(region) }}
          ref={(map) => { this.map = map }}
          onMapReady={() => { this.setState({ isMapReady: true }); console.log("map ready") }}
          onUserLocationChange={Location => {
            const { latitude, longitude, speed } = Location.nativeEvent.coordinate
            this.updateUserLocation(latitude, longitude, speed)
          }}
          loadingEnabled
        >
          {(this.state.isMapReady && this.state.showIcons) && renderIcons[this.state.selected]}
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
            onPress={() => this.map.animateToRegion(this.state.userLocation, 1500)}
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
          onPress={(toUpdate) => this.updateSelected(toUpdate)}
          updateFilterBank={(toUpdate) => { this.setState({ atmFilterBank: toUpdate }) }}
          selected={this.state.selected}
        />
        <ZoomInText show={!this.state.showIcons} />
        {/* {loadingLayer} */}
        {/* </Animated.View>

        </MaskedView> */}
      </View >
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
  },
  zoomInAlertContainer: {
    //marginHorizontal: 0 auto
  }
});
