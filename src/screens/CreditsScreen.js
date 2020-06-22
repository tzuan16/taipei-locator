import * as React from 'react';
import { View, StyleSheet, Text, Linking, Platform, Image } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../constants/Colors";
import { hasNotch } from "react-native-device-info";

import trashcan from "../../assets/images/trashcan-x.png";
import restroom from "../../assets/images/wc-x.png";
import atm from "../../assets/images/atm-x.png";
import vm from "../../assets/images/vm-x.png";
import clothing from "../../assets/images/clothing-x.png";
import bike from "../../assets/images/bike-x.png";

export default function CreditsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.openDrawerButtonContainer}>
        <MaterialCommunityIcons.Button
          name="menu"
          onPress={navigation.openDrawer}
          backgroundColor="rgba(0,0,0,0.2)"
          size={36}
          iconStyle={styles.openDrawerButton}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={[styles.title, { padding: 5 }]}>給建議</Text>
        <View style={styles.contentContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={20}
            style={{ marginTop: 5, marginRight: 5 }}
          />
          <Text
            style={{ fontSize: 16, textDecorationLine: "underline" }}
            onPress={() => { Linking.openURL("mailto:support@example.com?subject=找找台北意見回饋") }}
          >hungan@uw.edu</Text>
        </View>


        {/* <Text style={styles.title}>Logo</Text>
        <View style={styles.contentContainer}>
          <MaterialCommunityIcons
            name="account-edit"
            size={22}
            style={{ marginTop: 2, marginRight: 5 }}
          />
          <Text style={{ fontSize: 16 }}>Ivy Wu</Text>
        </View> */}

        <Text style={styles.title}>Icons</Text>
        <View style={styles.contentContainer}>
          <MaterialCommunityIcons
            name="google-chrome"
            size={22}
            style={{ marginTop: 2, marginRight: 5 }}
          />
          <Text style={{ fontSize: 16 }}>
            <Text
              onPress={() => { Linking.openURL("https://www.flaticon.com/authors/freepik") }}
              style={{ textDecorationLine: "underline" }}
            >Freepik</Text> & <Text
              onPress={() => { Linking.openURL("https://www.flaticon.com/authors/smashicons") }}
              style={{ textDecorationLine: "underline" }}
            >Smashicons</Text> from{"\n"}<Text
              onPress={() => { Linking.openURL("https://www.flaticon.com/") }}
              style={{ textDecorationLine: "underline" }}
            >https://www.flaticon.com/</Text>
          </Text>
        </View>
        <Text style={[styles.title, { padding: 5 }]}>圖例</Text>
        <View style={{ marginTop: 5 }}>
          <View style={[styles.legendContainer, { marginBottom: 9 }]}>
            <Image
              source={trashcan}
              style={{ width: 20, height: 20, marginRight: 5 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16 }}>ㄌㄚㄐㄧ桶</Text>
          </View>
          <View style={styles.legendContainer}>
            <Image
              source={restroom}
              style={{ width: 20, height: 20, marginRight: 5 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16 }}>公廁</Text>
          </View>
          <View style={[styles.legendContainer, { marginBottom: 10 }]}>
            <Image
              source={atm}
              style={{ width: 20, height: 18, marginRight: 7 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16 }}>ATM</Text>
          </View>
          <View style={styles.legendContainer}>
            <Image
              source={vm}
              style={{ width: 20, height: 18, marginRight: 5 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16 }}>販賣機</Text>
          </View>
          <View style={[styles.legendContainer, { marginBottom: 9 }]}>
            <Image
              source={bike}
              style={{ width: 20, height: 20, marginRight: 5 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16 }}>YouBike</Text>
          </View>
          <View style={styles.legendContainer}>
            <Image
              source={clothing}
              style={{ width: 20, height: 20, marginRight: 5 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16 }}>舊衣回收箱</Text>
          </View>
        </View>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.theme,
    borderWidth: 8,
    borderRadius: hasNotch() && Platform.OS == "ios" ? 40 : 0
  },
  openDrawerButtonContainer: {
    position: "absolute",
    left: 20,
    top: hasNotch() ? 50 : 30,
  },
  openDrawerButton: {
    marginRight: 0,
    marginVertical: -5
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    borderWidth: 2,
    borderRadius: 5,
    padding: 3,
    marginBottom: 10,
    textAlignVertical: "center",
    textAlign: "center"
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  }
});