import React from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Exercise from "./Pages/Exercise";
import AddExercise from "./Pages/AddExercise";
import EditExercise from "./Pages/EditExercise";
import Dashboard from "./Pages/Dashboard";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/login" component={Login} />
        <Route path="/add_exercise/" component={AddExercise} />
        <Route path="/edit_exercise/:id" component={EditExercise} />
        <Route path="/exercise/:id" component={Exercise} />
        <Route path="/dashboard/" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}
