import React from 'react';

import MapView, { Marker } from 'react-native-maps';
import trashcanIcon from "../../assets/images/trashcan.png";
import trashcanData from "../../assets/data/trashcans.json";
import within from "../functions/withinCoord"

export default class TrashcanMarkers extends React.PureComponent {
  render() {
    console.log("loading trashcan")

    return trashcanData.map((data) => {
      if (within(this.props.region, data.long, data.lat)) {


        return <TrashcanMarker data={data} />
      }
    }

    )
  }
}





function TrashcanMarker({ data }) {
  console.log("atm render")

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