import React from "react";
import themes from "../Data/themes";
import "./ThemeSwitcherStyle.css";
class ThemeSwitcher extends React.Component {
  state = { currentTheme: "rez" };

  componentDidMount() {
    var themeNumber = localStorage.getItem("@softboard:theme") || "0";
    const themeNames = Object.keys(themes);
    this.setState({ currentTheme: themeNames[themeNumber] });
    this.setTheme();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentTheme !== prevState.currentTheme) {
      this.setTheme();
    }
  }

  setTheme = () => {
    const theme = themes[this.state.currentTheme];
    Object.keys(theme).forEach(key => {
      const cssKey = `--${key}`;
      const cssValue = theme[key];
      document.body.style.setProperty(cssKey, cssValue);
    });
  };

  toggleTheme = () => {
    const themeNames = Object.keys(themes);
    const currentThemeIndex = themeNames.indexOf(this.state.currentTheme);
    if (currentThemeIndex === themeNames.length - 1) {
      this.setState({ currentTheme: themeNames[0] });
      localStorage.setItem("@softboard:theme", 0);
    } else {
      this.setState({ currentTheme: themeNames[currentThemeIndex + 1] });
      localStorage.setItem("@softboard:theme", currentThemeIndex + 1);
    }
  };

  render() {
    return (
      <>
        <input
          onClick={this.toggleTheme}
          className="react-switch-checkbox"
          id={`react-switch-new`}
          type="checkbox"
        />
        <label className="react-switch-label" htmlFor={`react-switch-new`}>
          <span className={`react-switch-button`} />
        </label>
      </>
    );
  }
}

export default ThemeSwitcher;
