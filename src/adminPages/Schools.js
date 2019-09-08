import React, { useState, useEffect } from "react";
import { db, auth } from "../utils/db";

function AddSchoolForm({ setSchools }) {
  let [name, setName] = useState("");
  let [color, setColor] = useState("");

  async function addSchool(ev) {
    ev.preventDefault();
    setName("");
    setColor("");
    let newSchool = { name, color };
    let docRef = await db.collection("schools").add(newSchool);
    let doc = await db
      .collection("schools")
      .doc(docRef.id)
      .get();
    setSchools(schools => [...schools, doc]);
  }

  return (
    <form className="AddSchoolForm" onSubmit={addSchool}>
      <input
        placeholder="name"
        value={name}
        onChange={ev => setName(ev.target.value)}
      />
      <input
        placeholder="color"
        value={color}
        onChange={ev => setColor(ev.target.value)}
      />
      <button>ADD</button>
    </form>
  );
}

function School({ school, setSchools }) {
  function deleteSchool() {
    setSchools(schools => schools.filter(s => s.id !== school.id));
    db.collection("schools")
      .doc(school.id)
      .delete();
  }

  let data = school.data();
  return (
    <div className="School">
      <div className="name" style={{ color: data.color }}>
        {data.name}
        {auth.currentUser.uid === "FiGZbzPMzYSeBjOetijiUybs6FR2" && (
          <button onClick={deleteSchool}>x</button>
        )}
      </div>
    </div>
  );
}

function Schools() {
  let [schools, setSchools] = useState([]);

  useEffect(() => {
    async function load() {
      let snapshot = await db.collection("schools").get();
      setSchools(snapshot.docs);
    }
    load();
  }, []);

  let sortedSchools = [...schools];
  sortedSchools.sort((a, b) => (a.data().name < b.data().name ? -1 : 1));

  return (
    <div className="Schools">
      <div className="list">
        {sortedSchools.map(s => (
          <School key={s.id} school={s} setSchools={setSchools} />
        ))}
      </div>

      <AddSchoolForm setSchools={setSchools} />
    </div>
  );
}

export default Schools;
