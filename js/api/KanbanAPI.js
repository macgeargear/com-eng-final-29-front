import Item from "../view/Item.js";

export default class KanbanAPI {
  static async insertItem(columnId, content) {
    const data = await read();
    const column = data.find((column) => column.id == columnId);
    const item = {
      id: Math.floor(Math.random() * 1e6),
      content,
    };

    if (!column) {
      throw new Error("Column does not exist.");
    }

    column.items.push(item);
    save(data);

    return item;
  }

  static async updateItem(itemId, newProps) {
    const [item, currentColumn] = (() => {
      const parentElement = document.querySelectorAll(".kanban__column-items");
      for (let i = 0; i < 3; ++i) {
        for (const thisItem of Array.from(parentElement[i].children)) {
          if (thisItem.dataset.id === itemId) {
            return [thisItem, i];
          }
        }
      }

      return [null, -1];
    })();

    if (!item) {
      throw new Error("Item not found.");
    }

    item.content =
      newProps.content === undefined ? item.content : newProps.content;

    updateAssignmentStatus(itemId, currentColumn);
  }
}

const getUserProfile = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  return await fetch(
    `http://${backendIPAddress}/courseville/get_profile_info`,
    options
  ).then((response) => response.json());
};

async function getCourseList() {
  const options = {
    method: "GET",
    credentials: "include",
  };
  let courseList = [];
  let res = await fetch(
    `http://${backendIPAddress}/courseville/get_courses`,
    options
  );
  let data = (await res.json()).data.student;
  // data.filter(course);
  for (const info of data) {
    // let course_info = await getCourseInfo(info.cv_cid);
    console.log(info);
    courseList.push({
      year: info.year,
      title: info.title,
      semester: info.semester,
      cv_cid: info.cv_cid,
    });
  }

  const lastYear = courseList.reduce((prev, curr) =>
    prev.year > curr.year ? prev.year : curr.year
  );

  // filter year
  courseList = courseList.filter((course) => {
    return course.year == lastYear;
  });

  // find max semester
  const lastSemester = courseList.reduce((prev, current) => {
    return prev.semester > current.semester ? prev.semester : current.semester;
  });

  // filter semester
  courseList = courseList.filter((course) => {
    return course.semester == lastSemester;
  });

  return courseList;
}

async function updateAssignmentStatus(assignmentCode, newStatus) {
  const options = {
    method: "PUT",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/assignment/status/${assignmentCode}/${newStatus}`,
    options
  );
}

let courseDropdown;
async function addCourseToDropDown() {
  courseDropdown = await getCourseList();
  const course_dropdown = document.getElementById("course-name");
  course_dropdown.innerHTML =
    "<option value='0'>-- Select Your Course --</option>";
  courseDropdown.map((course) => {
    course_dropdown.innerHTML += `<option value="${course.title}">${course.title}</option>`;
  });
}

async function getCourseInfo(cv_cid) {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const res = await fetch(
    `http://${backendIPAddress}/courseville/get_course_info/` + cv_cid,
    options
  );
  const data = await res.json();
  return data;
}

async function getCourseAssignments(cv_cid) {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const res = await fetch(
    `http://${backendIPAddress}/courseville/get_course_assignments/` + cv_cid,
    options
  );
  const data = await res.json();
  return data;
}

async function getAssignmentInfo(id) {
  const options = {
    method: "GET",
    credentials: "include",
  };
  return (
    await fetch(
      `http://${backendIPAddress}/courseville/get_assignment_detail/${id}`,
      options
    ).then((response) => response.json())
  ).data;
}

// selecting loading div
const loader = document.querySelector("#loading");
const loaderSelect = document.getElementById("#loading-selected");

// TODO: showing loading
function displayLoading() {
  loader.classList.add("display");
  document.querySelector(".kanban").style.display = "none";
}

// TODO: hiding loading
function hideLoading() {
  loader.classList.remove("display");
  document.querySelector(".kanban").style.display = "flex";
}

document.addEventListener("DOMContentLoaded", async function (event) {
  displayLoading();
  await addCourseToDropDown();
  hideLoading();
});

function clearItem() {
  const parentElement = document.getElementsByClassName("kanban__column-items"); // replace "parent-element" with the ID of the element you want to clear
  for (let i = 0; i < parentElement.length; ++i) {
    const allChild = parentElement[i].getElementsByClassName("kanban__item");
    for (let j = allChild.length - 1; j >= 0; --j) {
      parentElement[i].removeChild(allChild[j]);
    }
  }
}

function addRowInColumn(parentElement, id, content, instruction, dueTime) {
  const child = new Item(id, content, instruction, dueTime);
  if (String(child.elements.input.style.background) !== "rgb(17, 17, 17)") {
    parentElement.appendChild(child.elements.root);
  }
}

async function getAssignmentById(assignmentCode) {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const res = await fetch(
    `http://${backendIPAddress}/assignment/${assignmentCode}`,
    options
  );
  const data = await res.json();
  return data;
}

async function postAssignment(data) {
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body
  };
  await fetch(`http://${backendIPAddress}/assignment`, options);
}

const btn = document.getElementById("select-course");
btn.addEventListener("click", async () => {
  const selected = document.getElementById("course-name");
  clearItem();
  const parentElementAll = document.querySelectorAll(".kanban__column");
  const parentElement = document.querySelectorAll(".kanban__column-items");
  for (const parent of parentElementAll) {
    const loading = parent.querySelector("#loading");
    loading.style.display = "block";
  }

  const userId = (await getUserProfile()).user.id;
  console.log(userId);

  let courses = await getCourseList();
  console.log(courses);
  let id = courses.find(
    (course) => course.title === selected.options[selected.selectedIndex].value
  );
  const cvcid = id.cv_cid;

  let assignments = await getCourseAssignments(id.cv_cid);
  console.log(assignments);

  for (const assignment of assignments.data) {
    const id = assignment.itemid;
    const content = assignment.title;

    // const assignmentInfo = await getAssignmentInfo(id);
    // console.log(assignmentInfo);
    const assignmentCode = [userId, String(cvcid), String(id)].join("-");
    const data = await getAssignmentById(assignmentCode);
    let tar = parentElement[0];
    if (data.message == "ok") {
      tar = parentElement[Number(data.status)];
    } else {
      const data = {
        assignmentCode: assignmentCode,
        content: content,
        status: "0",
      };
      await postAssignment(data);
    }
    addRowInColumn(
      tar,
      assignmentCode,
      content,
      assignment.instruction,
      assignment.duetime
    );
  }

  for (const parent of parentElementAll) {
    const loading = parent.querySelector("#loading");
    loading.style.display = "none";
  }
});

export { getUserProfile };
