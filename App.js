
import 'react-native-gesture-handler';
import * as React from 'react';
import { Button, View } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';

import MapScreen from './src/screens/MapScreen'

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Picker
        selectedValue={"all"}
        style={{ width: 150, height: 50 }}
      //onValueChange={(itemValue) => { setBank(itemValue) }
      //}
      >
        <Picker.Item label="全部顯示" value="all" />
        <Picker.Item label="013 國泰世華銀行" value="13" />
        <Picker.Item label="822 中國信託商業銀行" value="822" />
      </Picker>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      />
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={MapScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
