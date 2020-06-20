import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import bikeIcon from "../../assets/images/bike.png";
import brokenBikeIcon from "../../assets/images/bike-gray.png";
import redBikeIcon from "../../assets/images/bike-red.png";
import MapView, { Marker } from 'react-native-maps';
import within from "../functions/withinCoord"

export default class BikeMarkers extends React.PureComponent {
  state = {
    isLoading: true,
    data: null,
    preselectedKey: "0000",
  }

  componentDidMount() {
    this.downloadData()
    setInterval(() => this.downloadData(), 60000)
  }

  downloadData = () => {
    console.log("download")
    fetch("https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json")
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.retVal });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  // forceUpdate = () => {
  //   this.downloadData()
  // }

  render() {
    if (this.state.isLoading) {
      return null
    } else {
      return Object.keys(this.state.data).map((key) => {
        let data = this.state.data[key];
        if (within(this.props.region, data.lng, data.lat)) {
          // let preselected = false;
          // if (this.state.preselectedKey == key) {
          //   preselected = true;
          // }
          return <BikeMarker
            data={data}
            index={key}
          //selectedKey={(key) => { this.setState({ preselectedKey: key }) }}
          //preselected={preselected}
          />
        }
      })
    }
  }
}

class BikeMarker extends React.Component {
  state = {
    pressed: false,
  }

  // componentDidUpdate() {
  //   console.log("update")
  //   this.props.preselected && this.marker.showCallout()
  // }

  renderIcon = () => {
    const { data } = this.props;
    if (data.act === "0") {
      return brokenBikeIcon;
    } else if (data.sbi === "0") {
      return redBikeIcon;
    }
    return bikeIcon;
  }

  render() {
    const { data, index, selectedKey, preselected } = this.props;
    let i = data.ar.indexOf("(鄰近");

    return (
      <Marker
        key={`${index}${Date.now()}`}
        coordinate={{ longitude: parseFloat(data.lng), latitude: parseFloat(data.lat) }}
        image={this.renderIcon()}
        tracksViewChanges={false}
        centerOffset={{ x: 0, y: -22 }}
        onPress={() => {
          this.setState({ pressed: true })
          //selectedKey(index)
        }}
      //ref={ref => { this.marker = ref }}
      >
        <MapView.Callout style={styles.calloutContainer} >
          {this.state.pressed ?
            <View style={{ flex: 1 }}>
              <Text style={styles.calloutTextTitle}> {data.sna} </Text>
              {i === -1 ?
                <Text style={{ fontSize: 11, paddingBottom: 8 }}> {data.ar}  </Text>
                :
                <View>
                  <Text style={{ fontSize: 11, paddingBottom: 1 }}> {data.ar.slice(0, i)}  </Text>
                  <Text style={{ fontSize: 11, paddingBottom: 8 }}> {data.ar.slice(i, data.ar.length)}  </Text>
                </View>
              }
              <View style={{
                flexDirection: "row", alignItems: "center", marginBottom: 2
              }}>
                <View style={styles.bikeIconContainer}>
                  <MaterialCommunityIcons
                    name="bike"
                    size={9}
                    color="#fff"
                    style={styles.bikeIcon}
                  />
                </View>
                <Text style={styles.calloutTextStrong}>可借數量：{data.sbi}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5
                  name="parking"
                  size={15}
                  style={{ marginLeft: 5, marginRight: 2 }}
                />
                <Text style={[styles.calloutTextStrong, { paddingTop: 0.5 }]}>空位數量：{data.bemp}</Text>
              </View>

            </View> :
            <View style={{ flex: 1 }}></View>}
        </MapView.Callout>
      </Marker>
    );
  }
}

const styles = StyleSheet.create({
  calloutContainer: {
    flex: 1,
  },
  calloutTextTitle: {
    fontSize: 15,
    paddingBottom: 5,
  },
  calloutTextStrong: {
    paddingLeft: 2,
    fontSize: 11,
    fontWeight: "800",
  },
  bikeIconContainer: {
    marginLeft: 5,
    marginRight: 2,
    borderRadius: 2,
    backgroundColor: "#000",
  },
  bikeIcon: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 2,
  }
});