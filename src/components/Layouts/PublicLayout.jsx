import React from "react";
import Navigation from "../Navigation/Navigation";
import { Outlet } from "react-router-dom";


export default function PublicLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}