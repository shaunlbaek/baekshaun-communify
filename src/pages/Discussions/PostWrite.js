import React, { useContext } from "react";
import { db } from "../../utils/db";
import { withRouter } from "react-router";
import UserContext from "../../contexts/UserContext";
import { FaSpinner } from "react-icons/fa";
import Loading from "../../components/Loading";

function PostWrite({ match, history }) {
  const user = useContext(UserContext);

  let [sub, setSub] = React.useState("");
  let [txt, setTxt] = React.useState("");
  let [loading, setLoading] = React.useState(false);

  async function addEntry(subject, txt) {
    setLoading(true);
    let data = {
      subject,
      created_at: new Date(),
      uid: user.uid,
      name: user.firstname + " " + user.lastname,
      comments: 0,
      commented_at: new Date()
    };

    let docRef = await db.collection("discussions").add(data);
    let doc = await db
      .collection("discussions")
      .doc(docRef.id)
      .get();

    await db
      .collection("discussions")
      .doc(docRef.id)
      .collection("content")
      .add({ txt });

    alert("success");
    history.push("/discussion");
  }

  function onSubmit(event) {
    event.preventDefault();
    addEntry(sub, txt);
    setSub("");
    setTxt("");
  }

  if (loading) return <Loading />;

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <input
        placeholder="subject"
        value={sub}
        onChange={event => setSub(event.target.value)}
      />
      <textarea
        placeholder="txt"
        value={txt}
        onChange={event => setTxt(event.target.value)}
      />
      <button className="post-button">POST</button>
    </form>
  );
}

export default withRouter(PostWrite);
