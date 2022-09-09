const { default: axios } = require("axios");
const express = require("express");
const app = express();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const port = 3001 | process.env.PORT;

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/api/getchapters/:title", async (req, res) => {
    let title = encodeURI(req.params.title);
    console.log("Title is: " + title);

    const htmlArray = [];
    let noMoreChapters = false;

    while (noMoreChapters == false) {
        let result;
        // fetch the page
        try {
            const pageUrl = `https://en.wikisource.org/w/api.php?action=parse&format=json&page=${title}&prop=text%7Clinks`;
            result = await axios.get(pageUrl);
            if(result.data.error) {
                console.log("Returning error")
                return res.status(400).send({error: true, message: "Title does not exist!"})
            }
        } catch (error) {
            console.log("Returning server error")
            return res.status(501).send({error: true, message: "Internal server error!"})
        }

        // create the HTML for that page
        const dom = new JSDOM(result.data.parse.text["*"]);
        htmlArray.push(dom.serialize());

        // figure out the next chapter heading
        let nextChapter = dom.window.document.querySelector("#headernext")?.childNodes;
        if (nextChapter === undefined)
            noMoreChapters = true;
        else {
            let nextChapterLink = nextChapter[0].href;
            let nextChapterTitle = nextChapterLink.trim().split("/").slice(2, nextChapterLink.trim().split("/").length).join("/");
            title = nextChapterTitle;
        }
    }
    const allChapters = htmlArray.join();
    res.status(200).send(allChapters);
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});