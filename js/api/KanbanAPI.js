export default class KanbanAPI {
  static async getItems(columnId) {
    // if (this.click) {
    //   const column = await read();
    //   const column_ = column.find((column) => column.id == columnId);
    //   console.log(column_);
    //   if (!column_) {
    //     return [];
    //   }

    //   return column_.items;
    // }
    // console.log(column);
    const column = await read();
    const column_ = column.find((column) => column.id == columnId);
    console.log(column_);
    if (!column_) {
      return [];
    }

    return column_.items;
  }

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
    const data = await read();
    const [item, currentColumn] = (() => {
      for (const column of data) {
        const item = column.items.find((item) => item.id == itemId);

        if (item) {
          return [item, column];
        }
      }
    })();

    if (!item) {
      throw new Error("Item not found.");
    }

    item.content =
      newProps.content === undefined ? item.content : newProps.content;

    // Update column and position
    if (newProps.columnId !== undefined && newProps.position !== undefined) {
      const targetColumn = data.find(
        (column) => column.id == newProps.columnId
      );

      if (!targetColumn) {
        throw new Error("Target column not found.");
      }

      // Delete the item from it's current column
      currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

      // Move item into it's new column and position
      targetColumn.items.splice(newProps.position, 0, item);
    }

    save(data);
  }

  static async deleteItem(itemId) {
    const data = await read();

    for (const column of data) {
      const item = column.items.find((item) => item.id == itemId);

      if (item) {
        column.items.splice(column.items.indexOf(item), 1);
      }
    }

    save(data);
  }
}

let courseDropdown;

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
    let course_info = await getCourseInfo(info.cv_cid);
    // console.log(course_info);
    courseList.push({
      year: course_info.data.year,
      title: course_info.data.title,
      semester: course_info.data.semester,
      cv_cid: course_info.data.cv_cid,
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
  // console.log(lastYear, lastSemester);
  // courseDropdown = courseList;
  // courseList.map((course) => {
  //   course_dropdown.innerHTML += `<option value="${course.title}">${course.title}</option>`;
  // });

  // console.log(courseList);
  return courseList;
  // return courseDropdown;
}

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
  // console.log(data);
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
  // console.log(data);
  return data;
}

async function read() {
  // const json = localStorage.getItem("kanban-data");
  const json = false;
  let currentBoard = [
    { id: 1, items: [] },
    { id: 2, items: [] },
    { id: 3, items: [] },
  ];
  let currentAssignments = [];

  let assignments = await getCourseAssignments(32200);
  for (const assignment of assignments.data) {
    currentAssignments.push({
      id: assignment.itemid,
      content: assignment.title,
    });
  }

  // console.log(currentAssignments);
  currentBoard[0].items.push(...currentAssignments);
  // return [
  //   { id: 1, items: [] },
  //   { id: 2, items: [] },
  //   { id: 3, items: [] },
  // ];
  // console.log(currentBoard);
  if (!json) return currentBoard;
  return JSON.parse(json);
}

function save(data) {
  localStorage.setItem("kanban-data", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", async function (event) {
  await addCourseToDropDown();
  // await getCourseList();
  await read();
  // await kanban.renderColumns();
});

const redrawDOM = () => {
  window.document.dispatchEvent(
    new Event("DOMContentLoaded", {
      bubbles: true,
      cancelable: true,
    })
  );
};

const btn = document.getElementById("select-course");
btn.addEventListener("click", async () => {
  const selected = document.getElementById("course-name");
  console.log(selected.options[selected.selectedIndex].value);
  let courses = await getCourseList();
  console.log(courses);
  let id = courses.find(
    (course) => course.title === selected.options[selected.selectedIndex].value
  );
  console.log(id.cv_cid);

  let assignments = await getCourseAssignments(id.cv_cid);
  let currentAssignments = [];
  for (const assignment of assignments.data) {
    currentAssignments.push({
      id: assignment.itemid,
      content: assignment.title,
    });
  }

  // console.log(currentAssignments);
  let currentBoard = [
    { id: 1, items: [] },
    { id: 2, items: [] },
    { id: 3, items: [] },
  ];
  currentBoard[0].items.push(...currentAssignments);
  console.log(currentAssignments);
  console.log(currentBoard);
  KanbanAPI.getItems();
  redrawDOM();
});
