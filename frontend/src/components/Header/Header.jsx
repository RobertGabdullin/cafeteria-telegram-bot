import React from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const clean = String(dateStr).replace(/\*/g, "");
  const d = new Date(clean);
  if (isNaN(d)) return clean;
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
}

export default function Header({ date }) {
  return React.createElement(
    "header",
    { className: styles.header },
    React.createElement(
      "div",
      { className: styles.leftSection },
      React.createElement("img", {
        src: logo,
        alt: "Логотип",
        className: styles.logo,
      })
    ),
    date &&
      React.createElement(
        "div",
        { className: styles.dateSection },
        React.createElement("span", { className: styles.date }, formatDate(date))
      )
  );
}