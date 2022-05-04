let db;
const request = indexedDB.open("budget-tracker", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("new_trans", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    uploadTrans();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["new_trans"], "readwrite");
  const transObjectStore = transaction.objectStore("new_trans");
  transObjectStore.add(record);
}

function uploadTrans() {
  const transaction = db.transaction(["new_trans"], "readwrite");
  const transObjectStore = transaction.objectStore("new_trans");
  const getAll = transObjectStore.getAll();
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(["new_trans"], "readwrite");
          const transObjectStore = transaction.objectStore("new_trans");
          transObjectStore.clear();
          alert("All Saved Transactions Have Been Submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", uploadTrans);
