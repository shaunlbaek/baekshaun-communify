import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { db } from "../../utils/db";

function ResourceEdit({ match, history }) {
  let [subject, setSubject] = useState(undefined);

  useEffect(() => {
    (async function() {
      let doc = await db
        .collection("resources")
        .doc(match.params.id)
        .get();
      console.log(doc.data());
      setSubject(doc.data().subject);
    })();
  }, [match.params]);

  async function updateResource(ev) {
    ev.preventDefault();
    await db
      .collection("resources")
      .doc(match.params.id)
      .update({ subject });
    history.push("/");
  }

  if (typeof subject === "undefined") return <div>Loading</div>;

  return (
    <div className="ResourceEdit container" onSubmit={updateResource}>
      <form className="form1 vertical">
        <label>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={ev => setSubject(ev.target.value)}
        />
        <button className="btn">Update</button>
      </form>
    </div>
  );
}

export default withRouter(ResourceEdit);
