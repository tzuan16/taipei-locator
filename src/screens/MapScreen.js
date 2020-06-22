import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import MapView from 'react-native-maps';
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
import ClothingMarkers from "../components/ClothingMarker";
import AnimatedFilterButton from "../components/AnimatedFilterButton";
import { hasNotch } from "react-native-device-info";

export default class MapScreen extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
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

      selected: "trashcan",
      iconsLoaded: false,
      atmFilterBank: "all",
      showIcons: true,
    }
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
    this.setState({ iconsLoaded: true })
  }

  updateSelected = (toUpdate) => {
    if (toUpdate != "atm") {
      this.updateShowIcons(this.state.mapRegion, toUpdate, this.state.atmFilterBank)
    }
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

  updateShowIcons = (region, nextItem, nextFilterBank) => {
    let threshold = (nextItem == "atm" && nextFilterBank == "all") ?
      0.015 : 0.05
    this.setState({ mapRegion: region })
    if (this.state.showIcons && this.state.mapRegion.longitudeDelta > threshold) {
      this.setState({
        showIcons: false,
      })
    } else if (!this.state.showIcons && this.state.mapRegion.longitudeDelta <= threshold) {
      this.setState({
        showIcons: true,
      })
    }
  }


  render() {
    const { navigation } = this.props;
    const renderIcons = {
      "restroom": <RestroomMarkers region={this.state.mapRegion} />,
      "trashcan": <TrashcanMarkers region={this.state.mapRegion} />,
      "atm": <AtmMarkers region={this.state.mapRegion} filter={this.state.atmFilterBank} />,
      "vm": <VMMarkers region={this.state.mapRegion} />,
      "bike": <BikeMarkers region={this.state.mapRegion} />,
      "clothing": <ClothingMarkers region={this.state.mapRegion} />
    };

    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={styles.mapStyle}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass
          initialRegion={this.state.userLocation}
          onRegionChangeComplete={region => { this.updateShowIcons(region, this.state.selected, this.state.atmFilterBank) }}
          ref={(map) => { this.map = map }}
          onMapReady={() => { this.setState({ isMapReady: true }) }}
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
              color={Colors.theme}
              style={{ paddingTop: 0 }}
            />
          </TouchableOpacity>
        </View>
        <AnimatedFilterButton
          onPress={(toUpdate) => { this.updateSelected(toUpdate) }}
          updateFilterBank={(toUpdate) => {
            this.updateShowIcons(this.state.mapRegion, "atm", toUpdate)
            this.setState({ atmFilterBank: toUpdate })
          }}
          selected={this.state.selected}
        />
        <ZoomInText show={!this.state.showIcons} />
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
  calloutTextTitle: {
    fontSize: 15,
    paddingBottom: 5,
  },
  calloutTextStrong: {
    paddingLeft: 2,
    fontSize: 10,
    fontWeight: "900",
  },
  openDrawerButtonContainer: {
    position: "absolute",
    left: 20,
    top: hasNotch() ? 50 : 30,
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
    borderColor: Colors.gray,
  },
});
