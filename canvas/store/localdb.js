const dbname = "string-db";
const dbVersion = 3;

const request = window.indexedDB.open(dbname, dbVersion);
request.onsuccess = (e) => {
  // console.log("hello", e.target?.result);
};

request.onupgradeneeded = (e) => {
  console.log(e)
}