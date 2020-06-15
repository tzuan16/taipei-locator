import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import restroomIcon from "../../assets/images/wc.png";
import MapView, { Marker } from 'react-native-maps';

export default class RestroomMarker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
    };
  }

  restroomType = (show, type) => {
    switch (type) {
      case "wheelchair":
        if (show == "Y") {
          return <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
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
          return <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
            <FontAwesome5
              name="child"
              size={12}
              style={{ paddingLeft: 5 }} />
            <Text style={styles.calloutTextStrong}>親子公廁</Text>
          </View>;
        }
        break;
    }
  }

  restroomRating = (num, level) => {

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

  restroomRatings = () => {
    const { data } = this.props;
    let ratings = [data.FirstLevel, data.SecondLevel, data.ThirdLevel, data.FourthLevel, data.FifthLevel]
    var renderRatings = [];
    for (let i = 0; i < 5; i++) {
      if (ratings[i] != "0") {
        renderRatings.push(this.restroomRating(ratings[i], i));
      }

    }
    return renderRatings;
  }

  render() {
    const { data, index } = this.props;
    return (
      <Marker
        key={`${index}${Date.now()}`}
        coordinate={{ longitude: parseFloat(data.Lng), latitude: parseFloat(data.Lat) }}
        image={restroomIcon}
        tracksViewChanges={false}
        ref={ref => { this.marker = ref }}
        onPress={() => { this.setState({ pressed: true }) }}
      >

        <MapView.Callout style={styles.calloutContainer} >
          {this.state.pressed ?
            <View>
              <Text style={styles.calloutTextTitle}> {data.DepName} </Text>
              <Text style={{ fontSize: 11, paddingBottom: 5 }}> {data.Address}  </Text>
              {this.restroomRatings(data)}
              {this.restroomType(data.Restroom, "wheelchair")}
              {this.restroomType(data.Childroom, "child")}

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
    paddingLeft: 2, fontSize: 10, fontWeight: "900",
  },
});