#! /usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

const User = require('./models/user');
const Group = require('./models/group');
const Post = require('./models/post');
const Comment = require('./models/comment');

const users = [];
const groups = [];
const posts = [];
const comments = [];

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

async function userCreate(index, data) {
  const user = new User(data);
  await user.save();
  users[index] = user;
  console.log(`Added user: ${data.username}`);
}

async function groupCreate(index, data) {
  const group = new Group(data);
  await group.save();
  groups[index] = group;
  console.log(`Added group: ${data.name}`);
}

async function postCreate(index, data) {
  const post = new Post(data);
  await post.save();
  posts[index] = post;
  console.log(`Added post: ${data.title}`);
  return post;
}

async function commentCreate(index, data) {
  const comment = new Comment(data);
  await comment.save();
  comments[index] = comment;
  console.log(`Added comment: ${data.content}`);
  return comment;
}

async function createUsers() {
  console.log('Adding users');
  await Promise.all([
    userCreate(0, {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password1',
      groups: [],
    }),
    userCreate(1, {
      username: 'user2',
      email: 'user2@example.com',
      password: 'password2',
      groups: [],
    }),
    userCreate(2, {
      username: 'user3',
      email: 'user3@example.com',
      password: 'password3',
      groups: [],
    }),
    userCreate(3, {
      username: 'user4',
      email: 'user4@example.com',
      password: 'password4',
      groups: [],
    }),
    userCreate(4, {
      username: 'user5',
      email: 'user5@example.com',
      password: 'password5',
      groups: [],
    }),
  ]);
}

async function createGroups() {
  console.log('Adding groups');
  await Promise.all([
    groupCreate(0, { name: 'Group 1', description: 'First group', owner: users[0]._id }),
    groupCreate(1, { name: 'Group 2', description: 'Second group', owner: users[2]._id }),
  ]);
}

async function assignUsersToGroups() {
  console.log('Assigning users to groups');

  users[0].groups.push(groups[0]._id);
  users[1].groups.push(groups[0]._id);
  await Promise.all([users[0].save(), users[1].save()]);

  users[2].groups.push(groups[1]._id);
  users[3].groups.push(groups[1]._id);
  users[4].groups.push(groups[1]._id);
  await Promise.all([users[2].save(), users[3].save(), users[4].save()]);
}

async function createPosts() {
  console.log('Adding posts');
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < 5; j++) {
      const post = await postCreate(j + i * 5, {
        title: `Post ${j + 1} in ${groups[i].name}`,
        content: lorem,
        author: users[i + 1]._id,
        group: groups[i]._id,
        comments: [],
      });
      posts.push(post);
    }
  }
}

async function createComments() {
  console.log('Adding comments');
  for (let i = 0; i < posts.length; i++) {
    for (let j = 0; j < 3; j++) {
      const comment = await commentCreate(j + i * 3, {
        content: `Comment ${j + 1} on ${posts[i].title}`,
        author: users[i % users.length]._id,
        likes: 0,
      });
      posts[i].comments.push(comment._id);
      await posts[i].save();
    }
  }
}

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);

  await createUsers();
  await createGroups();
  await assignUsersToGroups();
  await createPosts();
  await createComments();

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}
