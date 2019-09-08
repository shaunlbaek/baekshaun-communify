import React from "react";
import PostEntry from "./PostEntry";
import { db } from "../../utils/db";
import "./Discussion.scss";
import { FaEdit, FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function Discussion() {
  let [entry, setEntry] = React.useState([]);

  React.useEffect(() => {
    db.collection("discussions")
      .orderBy("created_at", "desc")
      .get()
      .then(snapshot => {
        setEntry(snapshot.docs);
      });
  }, []);

  return (
    <div className="Discussions container">
      <div className="writeBtn">
        <Link to="/dicussion/write" style={{ fontSize: 40 }}>
          <button>
            <span>
              <FaPencilAlt />
            </span>{" "}
            Write
          </button>
        </Link>
      </div>
      {entry.map(v => (
        <PostEntry key={v.id} v={v} />
      ))}
    </div>
  );
}

export default Discussion;
