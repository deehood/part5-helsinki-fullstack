// const _ = require("lodash");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Blog = require("../models/blog");

const saltThePassword = async (password) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  return passwordHash;
};

const initialUsers = [
  {
    username: "jinfo",
    name: "James fortis",
    password: "whatisthat",
    blogs: [],
  },
  {
    username: "morango",
    name: "monica lewinski",
    password: "cigar",
    blogs: [],
  },
  {
    username: "micas",
    name: "mikosio roma",
    password: "coisa",
    blogs: [],
  },
];

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Delete TEST",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const userTestId = async () => {
  const user = await User.find({ username: "micas" });

  return user[0]._id;
};

const initDB = async () => {
  // initialize users
  await User.deleteMany({});

  for (let user of initialUsers) {
    let userObject = new User(user);
    userObject.passwordHash = await saltThePassword(user.password);
    await userObject.save();
  }

  // initialize blogs with userid object in user field

  await Blog.deleteMany({});

  // foreach is a function and await will only run correctly in its scope and not in beforeEach
  const userId = await userTestId();

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    let blogIdToInsert = blogObject._id;
    blogObject["user"] = userId;

    await blogObject.save();

    // insert blogid into target user blogs array field

    const correctUser = await User.findById(userId);
    correctUser["blogs"].push(blogIdToInsert);

    await User.findByIdAndUpdate(userId, correctUser);
  }
};

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totaLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;

  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((x) => x.likes));

  const favoriteBlog = blogs.find((blog) => blog.likes === maxLikes);

  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: maxLikes,
  };
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};
// returns object with authors and accumulated blog posts
const mostBlogs = (blogs) => {
  // LODASH method
  // const authorsBlogCount = _.countBy(blogs, (blog) => blog.author);

  // REDUCE method

  const authorsBlogCount = blogs.reduce((accum, cur) => {
    accum[cur.author] ? (accum[cur.author] += 1) : (accum[cur.author] = 1);
    return accum;
  }, {});

  const max = Math.max(...Object.values(authorsBlogCount));

  return {
    author: getKeyByValue(authorsBlogCount, max),
    blogs: max,
  };
};

const mostLikes = (blogs) => {
  let maxLikes = 0;
  let authorMax = "";

  blogs.forEach((element) => {
    if (element.likes > maxLikes) {
      maxLikes = element.likes;
      authorMax = element.author;
    }
  });

  return {
    author: authorMax,
    likes: maxLikes,
  };
};

module.exports = {
  initDB,
  saltThePassword,
  dummy,
  totaLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initialBlogs,
  initialUsers,
};
