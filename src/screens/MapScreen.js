import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
//import MapView from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
import Layout from "../constants/Layout";
import trashcanIcon from "../../assets/images/delete.png";
import restroomIcon from "../../assets/images/wc.png";
import trashcanData from "../../assets/data/trashcans.json";
import restroomData from "../../assets/data/restrooms.json";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"


//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
export default class MapScreen extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      initialRegion: null,
      data: [],
      icon: null
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
          initialRegion: region
        })

        this.map.animateToRegion(region, 1000)
        console.log("animate")
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

  restroomType = (show, type) => {
    switch (type) {
      case "wheelchair":
        if (show == "Y") {
          return <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 2 }}>
            <FontAwesome5
              name="wheelchair"
              size={12}
              style={{ paddingLeft: 5 }} />
            <Text style={styles.calloutTextStrong}>無障礙公廁</Text>
          </View>;
        }
        break;
      case "child":
        if (show == "Y") {
          return <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 3 }}>
            <FontAwesome5
              name="child"
              size={12}
              style={{ paddingLeft: 5 }} />
            <Text style={styles.calloutTextStrong}>親子公廁</Text>
          </View>;
        }
        break;
      // case "kindly":
      //   if (show == "Y") {
      //     return <Text style={styles.calloutTextDes}>貼心公廁</Text>
      //   }
      //   break;
    }
  }

  restroomRating = (num, level) => {
    if (parseInt(num) > 0) {
      let ratingNames = ["特優", "優等", "普通", "加強", "改善"];
      let ratingIcons = ["grin-stars", "smile", "meh", "frown", "dizzy"]
      return <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 3 }}>
        <Text style={styles.calloutTextStrong}>{num}間｜</Text>
        <FontAwesome5
          name={ratingIcons[level]}
          size={12}
          style={{ paddingLeft: 2 }} />
        <Text style={styles.calloutTextStrong}>{ratingNames[level]}級</Text>
      </View>;
    }
  }

  loadTrashcans = () => {
    console.log("loadingTrashcans")
    return trashcanData.map((data) =>
      <Marker
        key={data.field1}
        coordinate={{ longitude: parseFloat(data.long), latitude: parseFloat(data.lat) }}
        title={data.road + data.address}
        description={data.remark}
        image={trashcanIcon}
        tracksViewChanges={false}
      />
    )
  }

  loadRestrooms = () => {
    console.log("loadingRestrooms")
    return restroomData.ToiletData.map((data) => {
      let ratings = [data.FirstLevel, data.SecondLevel, data.ThirdLevel, data.FourthLevel, data.FifthLevel]
      var renderRatings = [];
      for (let i = 0; i < 5; i++) {
        renderRatings.push(this.restroomRating(ratings[i], i))
      }
      return <Marker
        coordinate={{ longitude: parseFloat(data.Lng), latitude: parseFloat(data.Lat) }}
        image={restroomIcon}
        wtracksViewChanges={false}
      >
        <MapView.Callout style={styles.calloutContainer}>
          <View>
            <Text style={styles.calloutTextTitle}> {data.DepName} </Text>
            <Text style={{ fontSize: 11, paddingBottom: 5 }}> {data.Address}  </Text>
            {renderRatings}
            {this.restroomType(data.Restroom, "wheelchair")}
            {this.restroomType(data.Childroom, "child")}

          </View>
        </MapView.Callout>
      </Marker>
    }
    )
  }

  render() {
    const { navigation } = this.props
    if (this.state.initialRegion == null) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={{ color: "black" }}>我還在找..</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.mapContainer} >
          <MapView
            style={styles.mapStyle}
            showsUserLocation
            showsMyLocationButton
            showsCompass
            region={this.state.initialRegion}
            //initialRegion={{ longitude: 122, latitude: 25.5, longitudeDelta: 0.01, latitudeDelta: 0.01 }}
            ref={(map) => { this.map = map }}
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
        </View>

      );
    }
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
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
