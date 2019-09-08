import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router";
import { db, firebase } from "../../utils/db";
import {
  format,
  differenceInHours,
  differenceInMinutes,
  differenceInDays
} from "date-fns";
import UserContext from "../../contexts/UserContext";
import { FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function CommentForm({ addComment }) {
  let [comment, setComment] = useState("");
  return (
    <form
      onSubmit={ev => {
        ev.preventDefault();
        addComment(comment);
        setComment("");
      }}
    >
      <input
        type="text"
        value={comment}
        onChange={ev => setComment(ev.target.value)}
      />
      <button>add</button>
    </form>
  );
}

const Comment = ({ data }) => {
  let hours = differenceInHours(new Date(), data.created_at.toDate());
  let minutes = differenceInMinutes(new Date(), data.created_at.toDate());
  let days = differenceInDays(new Date(), data.created_at.toDate());

  return (
    <div>
      {data.name}: {data.comment}
      {hours > 0 ? (
        <span>({hours} hours ago)</span>
      ) : (
        <span>({minutes} minutes ago)</span>
      )}
    </div>
  );
};

let Viewer = ({ match }) => {
  let [discussion, setDiscussion] = useState(undefined);
  let [content, setContent] = useState("");
  let [comments, setComments] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    db.collection("discussions")
      .doc(match.params.id)
      .get()
      .then(doc => setDiscussion(doc));

    db.collection("discussions")
      .doc(match.params.id)
      .collection("content")
      .get()
      .then(snapshot => setContent(snapshot.docs[0].data().txt));

    db.collection("discussions")
      .doc(match.params.id)
      .collection("comments")
      .orderBy("created_at", "asc")
      .get()
      .then(snapshot => {
        let docs = [...snapshot.docs];
        docs.sort(
          (a, b) =>
            a
              .data()
              .created_at.toDate()
              .getTime() -
            b
              .data()
              .created_at.toDate()
              .getTime()
        );
        setComments(docs);
      });
  }, []);

  async function addComment(comment) {
    let data = {
      uid: user.uid,
      name: user.firstname + " " + user.lastname,
      created_at: new Date(),
      comment
    };

    let docRef = await db
      .collection("discussions")
      .doc(match.params.id)
      .collection("comments")
      .add(data);
    let doc = await db
      .collection("discussions")
      .doc(match.params.id)
      .collection("comments")
      .doc(docRef.id)
      .get();

    await db
      .collection("discussions")
      .doc(match.params.id)
      .update({
        comments: firebase.firestore.FieldValue.increment(1)
      });

    setComments([...comments, doc]);
  }

  if (typeof discussion === "undefined") return <div>Loading...</div>;

  return (
    <div className="Viewer">
      <h1>{discussion.data().subject}</h1>

      <div className="right-txt">
        by {discussion.data().name}&nbsp;@&nbsp;
        {format(discussion.data().created_at.toDate(), "YYYY-MM-DD")}
      </div>

      <div className="content">{content}</div>

      <h4>Comments</h4>

      {comments.map(c => (
        <Comment key={c.id} data={c.data()} />
      ))}

      <CommentForm addComment={addComment} />
    </div>
  );
};
Viewer = withRouter(Viewer);

export default Viewer;
