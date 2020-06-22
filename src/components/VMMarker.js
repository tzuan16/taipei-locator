import React from 'react';

import MapView, { Marker } from 'react-native-maps';
import vmIcon from "../../assets/images/vm.png";
import vmData from "../../assets/data/vms.json";
import within from "../functions/withinCoord"

export default class VMMarkers extends React.PureComponent {
  render() {
    return vmData.map((data) => {
      if (within(this.props.region, data.lng, data.lat)) {
        return <VMMarker data={data} />
      }
    })
  }
}

function VMMarker({ data }) {
  return (
    <Marker
      key={data.index}
      coordinate={{ longitude: data.lng, latitude: data.lat }}
      title={data.name}
      description={data.co}
      image={vmIcon}
      tracksViewChanges={false}
    >
    </Marker>
  )
}