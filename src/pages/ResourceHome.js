import React, { useContext, useState, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import "./Resource.scss";
import { Link, withRouter } from "react-router-dom";
import { db } from "../utils/db";
import { ResourceEntry } from "./ResourceList";

const DATA = {
  English: [
    "Literary & Language Arts",
    "American Literary & Language Arts",
    "AP English Language & Composition"
  ],
  Science: ["Biology", "Chemestry", "Physics"],
  History: ["World History", "American History ", "AP Human Geography"],
  Language: ["Spanish", "Chinese", "Korean", "French"],
  Math: [
    "Math 1",
    "Math 2 CP H",
    "Math 3 CP H",
    "AP Calculus AB BC",
    "AP Statistics"
  ]
};

function ResourceHome() {
  const user = useContext(UserContext);

  let [resources, setResources] = useState([]);

  useEffect(() => {
    db.collection("resources")
      .orderBy("created_at", "desc")
      .limit(10)
      .get()
      .then(snapshot => setResources(snapshot.docs));
  }, []);

  return (
    <div className="ResourceHome container">
      <div>
        <h3>What do you need help on today?</h3>

        <ul>
          {Object.keys(DATA).map(k => (
            <li key={k}>
              <Link to={"/resource/" + k}>{k}</Link>
            </li>
          ))}
        </ul>
      </div>
      <h3>Recent</h3>
      {resources.map(r => (
        <ResourceEntry key={r.id} r={r} showDetail={true} />
      ))}
    </div>
  );
}

let ResourceChoose = ({ match }) => {
  const subject = match.params.subjectName;
  return (
    <React.Fragment>
      <div className="breadcrumbs">
        <Link to="/">Resource Home</Link> &nbsp;/&nbsp;
        {match.params.subjectName}
      </div>
      <h4>
        Select a <strong>{"{" + subject + "}"}</strong> class
      </h4>
      <ul>
        {DATA[subject].map((clazz, i) => (
          <li key={i}>
            <Link to={"/resource/" + subject + "/" + clazz}>{clazz}</Link>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};
ResourceChoose = withRouter(ResourceChoose);

export { ResourceHome, ResourceChoose };
