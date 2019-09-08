import React, { useState, useEffect } from "react";
import { db } from "../utils/db";
import { link } from "fs";

function EnterSchool1({ setUserCtx, userCtx }) {
  let [school, setSchool] = useState("");
  let [schools, setSchools] = useState([]);

  useEffect(() => {
    db.collection("schools")
      .get()
      .then(snapshot => {
        setSchools(snapshot.docs);
      });
  });

  return (
    <div>
      <h1>School</h1>
      {schools.map(s => (
        <button
          key={s.id}
          onClick={() => {
            setSchool(s);
          }}
          className={"btn " + (s.id === school.id ? "secondary" : "primary")}
          style={{
            margin: "5px"
          }}
        >
          {s.data().name}
        </button>
      ))}

      <hr />
      <button
        className="primary btn"
        onClick={() => {
          console.log(userCtx);
          let newUserCtx = {
            ...userCtx,
            schoolId: school.id,
            schoolName: school.data().name
          };
          localStorage.setItem("userCtx", JSON.stringify(newUserCtx));
          setUserCtx(newUserCtx);
        }}
      >
        Save
      </button>
      <div className="as-a" onClick={() => link()}>
        Request School
      </div>
    </div>
  );
}

export default EnterSchool1;
