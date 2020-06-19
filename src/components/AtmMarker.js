import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import atmIcon from "../../assets/images/atm.png";
import atmData from "../../assets/data/atms.json";
import within from "../functions/withinCoord"

export default class AtmMarkers extends React.PureComponent {
  render() {
    return atmData.map((data) => {
      if (within(this.props.region, data.lon, data.lat)) {
        if (this.props.filter === "all") {
          return <AtmMarker data={data} />
        } else if (this.props.filter == data.code) {
          return <AtmMarker data={data} />
        }
      }
    })
  }
}

class AtmMarker extends React.Component {
  state = {
    pressed: false
  }
  render() {
    const { data } = this.props;
    console.log("render atm", this.state.pressed)
    return (
      <Marker
        key={`${data.id}${Date.now()}`}
        coordinate={{ longitude: data.lon, latitude: data.lat }}
        image={atmIcon}
        tracksViewChanges={false}
        onPress={() => { this.setState({ pressed: true }) }}
      >
        {this.state.pressed ?
          <MapView.Callout style={styles.calloutContainer} >

            <View style={{ height: 50 }}>
              <Text style={styles.calloutTextTitle}> {data.location} </Text>
              <Text style={{ fontSize: 11, paddingBottom: 5 }}> {data.address}  </Text>
              <Text style={styles.calloutTextStrong}> {("00" + data.code).slice(-3)} {data.bank}  </Text>

            </View>

          </MapView.Callout> : null}
      </Marker>
    )
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
    paddingLeft: 2, fontSize: 10, fontWeight: "900",
  },
});