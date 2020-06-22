import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import MapScreen from '../screens/MapScreen';
import CreditsScreen from "../screens/CreditsScreen";
import Colors from "../constants/Colors";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {/* <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      /> */}
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (

    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: Colors.theme
        //width: 240,
      }}
      drawerContentOptions={{
        activeTintColor: "#fff",
        activeBackgroundColor: Colors.theme,
      }}
    >
      <Drawer.Screen name="地圖" component={MapScreen} />
      <Drawer.Screen name="聯絡我" component={CreditsScreen} />
    </Drawer.Navigator>
  )
}