import React from "react";
import { Image } from "react-native";
import styles from "../styles";

const AppLogo = () => {
  return (
    <Image
      source={require("../assets/logo.png")}
      style={styles.logoImage}
      resizeMode="contain"
    />
  );
};

export default AppLogo;
