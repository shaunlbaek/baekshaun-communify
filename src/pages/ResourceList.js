import React, { useState, useContext, useEffect, Fragment } from "react";
import { withRouter } from "react-router";
import { db, storage } from "../utils/db";
import UserContext from "../contexts/UserContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function ResourceEntry({ r, showDetail }) {
  const data = r.data();
  const user = useContext(UserContext);

  return (
    <div className={"ResourceEntry " + (showDetail ? "verbose" : "")}>
      {showDetail === true && (
        <Fragment>
          <div>{format(new Date(data.created_at), "YYYY-MM-DD")}</div>
          <div>{data.className}</div>
        </Fragment>
      )}
      <div>
        {data.subject} by {"{" + data.name + "}"}
        {data.uid === user.uid && (
          <Link to={`/resource/edit/${r.id}`}>Edit</Link>
        )}
      </div>
      <div className="links">
        {data.link.length > 0 && (
          <a
            target="_blank"
            href={
              data.link.substring(0, 4) === "http"
                ? data.link
                : "https://" + data.link
            }
          >
            Link
          </a>
        )}

        {data.filenames &&
          data.filenames.map((fn, i) => (
            <a key={i} href={fn}>
              File
            </a>
          ))}
      </div>
    </div>
  );
}

function PostForm({ setShowForm, addResource }) {
  let [subject, setSubject] = useState("");
  let [link, setLink] = useState("");

  let fileInputRef = React.createRef();

  return (
    <div className="post-form">
      <form
        className="form1"
        onSubmit={ev => {
          ev.preventDefault();
          let promises = [];
          let promises2 = [];

          for (let i = 0; i < fileInputRef.current.files.length; i++) {
            let file = fileInputRef.current.files[i];
            let ts = new Date().getTime();
            let filename = "" + ts + i;
            promises[i] = storage
              .ref()
              .child(filename)
              .put(file);
          }

          Promise.all(promises).then(filenames => {
            promises2 = [];
            filenames.forEach((fn, i) => {
              promises2[i] = fn.ref.getDownloadURL();
            });
            Promise.all(promises2).then(urls => {
              addResource(subject, link, urls);
              setShowForm(false);
            });
          });
        }}
      >
        <h3>Upload Your Resource</h3>
        <label>Resource Name</label>
        <input
          type="text"
          value={subject}
          onChange={ev => setSubject(ev.target.value)}
        />
        <label>Resource Link</label>
        <input
          type="text"
          value={link}
          onChange={ev => setLink(ev.target.value)}
        />
        <label>File</label>

        <input type="file" ref={fileInputRef} multiple />

        <button>ADD</button>
        <button type="button" onClick={() => setShowForm(false)}>
          X
        </button>
      </form>
    </div>
  );
}

let ResourceList = ({ match }) => {
  const className = match.params.className;
  let [resources, setResources] = useState([]);
  let [showForm, setShowForm] = useState(false);
  let user = useContext(UserContext);

  useEffect(() => {
    db.collection("resources")
      .where("className", "==", className)
      .get()
      .then(snapshot => setResources(snapshot.docs));
  }, [className]);

  async function addResource(subject, link, filenames) {
    let docRef = await db.collection("resources").add({
      className,
      subject,
      link,
      filenames,
      uid: user.uid,
      name: user.firstname + " " + user.lastname[0],
      created_at: new Date().getTime()
    });
    let doc = await db
      .collection("resources")
      .doc(docRef.id)
      .get();
    setResources([doc, ...resources]);
  }

  return (
    <div className="ResourceList">
      <div className="breadcrumbs">
        <Link to="/">Resource Home</Link> &nbsp;/&nbsp;
        <Link to={"/resource/" + match.params.subjectName}>
          {match.params.subjectName}
        </Link>
        &nbsp;/&nbsp; {match.params.className}
      </div>

      <button onClick={() => setShowForm(true)}>Post your resource</button>

      <div className="list">
        {resources.map(r => (
          <ResourceEntry key={r.id} r={r} />
        ))}
      </div>

      {showForm && (
        <PostForm setShowForm={setShowForm} addResource={addResource} />
      )}
    </div>
  );
};
ResourceList = withRouter(ResourceList);

export { ResourceList, ResourceEntry };
