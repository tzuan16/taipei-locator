import React from 'react';

import { Marker } from 'react-native-maps';
import clothingIcon from "../../assets/images/clothing.png";
import clothingData from "../../assets/data/clothing.json";
import within from "../functions/withinCoord";

export default class ClothingMarkers extends React.PureComponent {
  render() {
    return clothingData.map((data) => {
      if (within(this.props.region, data.lng, data.lat)) {
        return <ClothingMarker data={data} />
      }
    })
  }
}

function ClothingMarker({ data }) {
  return (
    <Marker
      key={data.id}
      coordinate={{ longitude: data.lng, latitude: data.lat }}
      title={data.foundation}
      description={data.address}
      image={clothingIcon}
      tracksViewChanges={false}
    >
    </Marker>
  )
}