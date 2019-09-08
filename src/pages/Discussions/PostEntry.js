import React, { useEffect } from "react";
import "./Post.scss";
import { format } from "date-fns";
import { db } from "../../utils/db";
import { Link } from "react-router-dom";

function PostEntry({ v }) {
  //let [showTxt, setShowTxt] = React.useState(true);
  let [comments, setComments] = React.useState([]);
  //let toggleTxt = () => setShowTxt(!showTxt);
  let data = v.data();

  useEffect(() => {
    db.collection("discussions")
      .doc(v.id)
      .collection("comments")
      .get()
      .then(snapshot => setComments(snapshot.docs));
  }, []);
  //onClick={toggleTxt}
  return (
    <div className="PostEntry">
      <Link to={"/discussion/" + v.id}>
        {data.subject} [{data.comments}]
      </Link>
      <div className="author">{data.name}</div>
      <div>{format(data.created_at.toDate(), "YYYY-MM-DD hh:mm")}</div>
    </div>
  );
}

export default PostEntry;
