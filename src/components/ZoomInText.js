import React, { useRef, useEffect } from "react";
import {
  Text,
  Animated,
  View,
} from 'react-native';
import Layout from "../constants/Layout";

const dim = { x: 160, y: 50 };

export default function ZoomInText({ show }) {
  const aniOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    console.log(show, "update")
    Animated.timing(aniOpacity, {
      toValue: show ? 1 : 0,
      duration: 250,
      useNativeDriver: true
    }).start()
  }, [show])
  console.log(aniOpacity)
  if (show) {
    return (
      <Animated.View style={{
        position: "absolute",
        width: dim.x,
        height: dim.y,
        left: (Layout.window.width - dim.x) / 2,
        top: (Layout.window.height - dim.y) / 2,
        backgroundColor: "#303030",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#fff",
        opacity: aniOpacity,
      }}>
        <Text style={{ color: "#fff" }}>放大以顯示圖標</Text>
      </Animated.View>
    )
  } else {
    return null
  }
}