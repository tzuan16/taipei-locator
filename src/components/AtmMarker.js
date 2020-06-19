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
    return atmData.map((data, i) => {
      if (this.props.filter === "all") {
        if (within(this.props.region, data.lon, data.lat)) {
          return <AtmMarker data={data} index={i} />
        }
      } else if (this.props.filter == data.code) {
        if (within(this.props.region, data.lon, data.lat)) {
          return <AtmMarker data={data} index={i} />
        }
      }
    })
  }
}

class AtmMarker extends React.PureComponent {
  state = {
    pressed: false
  }
  render() {
    const { data, index } = this.props;
    return (
      <Marker
        key={`${index}${Date.now()}`}
        coordinate={{ longitude: data.lon, latitude: data.lat }}
        image={atmIcon}
        tracksViewChanges={false}
        onPress={(e) => { this.setState({ pressed: true }) }}
      >
        {this.state.pressed ?
          <MapView.Callout style={styles.calloutContainer} >

            <View>
              <Text style={styles.calloutTextTitle}> {data.location} </Text>
              <Text style={{ fontSize: 11, paddingBottom: 5 }}> {data.address}  </Text>
              <Text style={styles.calloutTextStrong}> {("00" + data.code).slice(-3)} {data.bank}  </Text>
            </View>
          </MapView.Callout>
          : null}
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