import { readFileSync, writeFileSync } from "node:fs";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let posts = [];
try {
  posts = JSON.parse(readFileSync("posts.json", "utf-8"));
} catch {
  posts = [];
}

app.get("/", (req, res) => {
  res.render("index", { posts: posts });
});

app.get("/post", (req, res) => {
  res.render("post");
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/edit", (req, res) => {
  res.render("edit");
});

app.post("/create", (req, res) => {
  const d = new Date();
  const date = d.toDateString() + " " + d.toLocaleTimeString();
  const id = Date.now();
  savePosts({
    id: id.toString(),
    date: date,
    title: req.body["title"],
    content: req.body["content"],
  });
  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  posts = posts.filter((p) => p.id != req.params.id);
  writeFileSync("posts.json", JSON.stringify(posts));
  res.redirect("/");
});

app.post("/edit/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id == req.params.id);
  posts[index].title = req.body.title;
  posts[index].content = req.body.content;
  writeFileSync("posts.json", JSON.stringify(posts));
  res.redirect(`/post/${req.params.id}`);
});

app.get("/post/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  res.render("post", { post: post });
});

app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  res.render("edit", { post: post });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

function savePosts(post) {
  posts.push(post);
  writeFileSync("posts.json", JSON.stringify(posts));
}
