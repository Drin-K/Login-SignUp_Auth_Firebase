// app/_layout.jsx
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack initialRouteName="login" screenOptions={{ headerShown: false }} />
    </>
  );
}
