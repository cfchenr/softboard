import React from 'react';
import themes from '../Data/themes';
import './ThemeSwitcherStyle.css'
class ThemeSwitcher extends React.Component {
  state = { currentTheme: 'rez' }

  componentDidMount() {
    this.chooseRandomTheme();
    this.setTheme();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentTheme !== prevState.currentTheme) {
      this.setTheme();
    }
  }

  setTheme = () => {
    const theme = themes[this.state.currentTheme];
    Object.keys(theme).forEach((key) => {
      const cssKey = `--${key}`;
      const cssValue = theme[key];
      document.body.style.setProperty(cssKey, cssValue);
    });
  }

  chooseRandomTheme = () => {
    const themeNames = Object.keys(themes);
    const randomThemeNumber = Math.floor(Math.random() * themeNames.length);
    this.setState({ currentTheme: themeNames[randomThemeNumber] });
  }
  toggleTheme = () => {
    const themeNames = Object.keys(themes);
    const currentThemeIndex = themeNames.indexOf(this.state.currentTheme);
    if (currentThemeIndex === themeNames.length - 1) {
      this.setState({ currentTheme: themeNames[0] });
    } else {
      this.setState({ currentTheme: themeNames[currentThemeIndex + 1] });
    }
  }

  render() {
    return (
      <>
      <input
        onClick={this.toggleTheme}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
    );
  }
}

export default ThemeSwitcher;