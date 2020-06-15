import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import trashcanIcon from "../../assets/images/delete.png";


export default function RestroomMarker({ data }) {
  return (
    <Marker
      key={data.field1}
      coordinate={{ longitude: parseFloat(data.long), latitude: parseFloat(data.lat) }}
      title={data.road + data.address}
      description={data.remark}
      image={trashcanIcon}
      tracksViewChanges={false}
    >
    </Marker>
  )
}