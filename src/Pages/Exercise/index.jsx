import React, { useState } from "react";

import Navigationbar from "../Components/Navigationbar";
import ListExercises from "../Components/ListExercises";

export default function Exercise(props) {
  const [search_string, setSearch] = useState(props.match.params.id);

  return (
    <>
      <div className="background">
        <Navigationbar search_string={search_string} setSearch={setSearch} />
        <ListExercises search_string={search_string} setSearch={setSearch} />
      </div>
    </>
  );
}
