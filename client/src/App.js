import axios from "axios";
import { useState } from "react";

const App = () => {

  const [title, setTitle] = useState("");

  // function to query the API to get combined chapters
  const getChapterData = async () => {
    try {
      const resp = await axios.get(`/api/getchapters/${title}`);
      if(resp.status === 200) {
        // get the new combined html document
        document.querySelector(".display-html").innerHTML = resp.data;
      }
    } catch (error) {
      window.alert(error.response.data.message)
    }
  }
  return (
    <div className="wrapper">
      <div className="user-input">
        <input placeholder="Enter title of work" onChange={(e) => setTitle(e.target.value)} />
        <button onClick={getChapterData}>Search</button>
      </div>
      <div className="display-html"></div>
    </div>
  );
}

export default App;
