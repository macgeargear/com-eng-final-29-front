const backendIPAddress = "127.0.0.1:3000";

const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

const getGroupNumber = () => {
  return 29;
};

async function getItem(column, cv_cid) {
  await fetch(
    `http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`,
    { method: "GET", credentials: "include" }
  )
    .then((res) => res.json())
    .then(({ data }) => {
      data.map((assignment) => {});
    });
}

function insertItem() {}

function updateItem() {}

function deleteItem() {}
