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

        return <AtmMarker data={data} />
      }
    })
  }
}

function AtmMarker({ data }) {
  //const [pressed, setPressed] = useState(false);
  return (
    <Marker
      key={data.id}
      coordinate={{ longitude: data.lon, latitude: data.lat }}
      image={atmIcon}
      tracksViewChanges={false}
    //onPress={() => { }}
    >
      <MapView.Callout style={styles.calloutContainer} >
        <View>
          <Text style={styles.calloutTextTitle}> {data.location} </Text>
          <Text style={{ fontSize: 11, paddingBottom: 5 }}> {data.address}  </Text>
          <Text style={styles.calloutTextStrong}> {("00" + data.code).slice(-3)} {data.bank}  </Text>

        </View>
      </MapView.Callout>
    </Marker>
  )
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