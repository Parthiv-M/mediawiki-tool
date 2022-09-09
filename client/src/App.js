import axios from "axios";
import { useState } from "react";

const App = () => {

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataObtained, setDataObtained] = useState(false);

  // function to query the API to get combined chapters
  const getChapterData = async () => {
    setLoading(true);
    document.querySelector(".display-html").innerHTML = "";
    if (title === "") {
      alert("Please enter a title");
      setLoading(false);
      setDataObtained(false);
      return;
    }
    try {
      const resp = await axios.get(`/api/getchapters/${title}`);
      if (resp.status === 200) {
        // get the new combined html document
        setLoading(false);
        document.querySelector(".display-html").innerHTML = resp.data;
        setDataObtained(true);
      }
    } catch (error) {
      setLoading(false);
      window.alert(error.response.data.message)
    }
  }
  return (
    <div className="wrapper">
      <div className="user-input">
      <h3>WikiSource Featured Text Search</h3>
        <div className="input-area">
          <input placeholder="Enter title of work" onChange={(e) => setTitle(e.target.value)} />
          <button onClick={getChapterData}>Search</button>
        </div>
      </div>
      {loading && <p className="loading">Loading all chapters...</p>}
      <div className="display-html" style={{border: `${dataObtained ? "1px solid gray" : ""}`}}></div>
    </div>
  );
}

export default App;
