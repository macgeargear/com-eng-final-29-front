export default class KanbanAPI {
  static getItems(columnId) {
    const column = read().find((column) => column.id == columnId);

    if (!column) {
      return [];
    }

    return column.items;
  }

  static insertItem(columnId, content) {
    const data = read();
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

  static updateItem(itemId, newProps) {
    const data = read();
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

  static deleteItem(itemId) {
    const data = read();

    for (const column of data) {
      const item = column.items.find((item) => item.id == itemId);

      if (item) {
        column.items.splice(column.items.indexOf(item), 1);
      }
    }

    save(data);
  }
}

async function getCourseList() {
  const course_dropdown = document.getElementById("name-to-add");
  course_dropdown.innerHTML =
    "<option value='0'>-- Select Your Course --</option>";
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
    let course_info = (await getCourseInfo(info.cv_cid)).data;
    // console.log(course_info);
    courseList.push({
      year: course_info.year,
      title: course_info.title,
      semester: course_info.semester,
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

  courseList.map((course) => {
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

function read() {
  return [
    { id: 1, items: [{ id: 898055, content: "kjkjk" }] },
    {
      id: 2,
      items: [
        { id: 312189, content: "jkjkj" },
        { id: 122445, content: "jkjkj" },
      ],
    },
    { id: 3, items: [] },
  ];
}

function save(data) {
  localStorage.setItem("kanban-data", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", async function (event) {
  await getCourseList();
});
