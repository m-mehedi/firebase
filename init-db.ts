
import {COURSES, findLessonsForCourse} from './db-data';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var config = {
  apiKey: "AIzaSyBQlq65yR4E-Bwfdxtk5Nyi1oMC5DhB-Ec",
  authDomain: "freya-dfbab.firebaseapp.com",
  databaseURL: "https://freya-dfbab.firebaseio.com",
  projectId: "freya-dfbab",
  storageBucket: "freya-dfbab.appspot.com",
  messagingSenderId: "1075690485776",
  appId: "1:1075690485776:web:540db451af3f9478fdb295"
};

console.log("Uploading data to the database with the following config:\n");

console.log(JSON.stringify(config));

console.log("\n\n\n\nMake sure that this is your own database, so that you have write access to it.\n\n\n");

const app = firebase.initializeApp(config);
const db = firebase.firestore();

main().then(r => console.log('Done.'));

async function uploadData() {
  const courses = await db.collection('courses');
  for (let course of Object.values(COURSES)) {
    const newCourse = removeId(course);
    const courseRef = await courses.add(newCourse);
    const lessons = await courseRef.collection('lessons');
    const courseLessons = findLessonsForCourse(course['id']);
    console.log(`Uploading course ${course['titles']["description"]}`);
    for (const lesson of courseLessons) {
      const newLesson = removeId(lesson);
      await lessons.add(newLesson);
    }
  }
}

function removeId(data: any) {
  const newData: any = {...data};
  delete newData.id;
  return newData;
}

async function main(){
  try {
    console.log('Start main...\n\n');
    await uploadData();
    console.log('\n\nClosing Application...');
    await app.delete();
  }catch (e) {
    console.log('Data upload failed, reason:', e, '\n\n');
  }
}

