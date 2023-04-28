import Item from "../view/Item.js";

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
    const [item, currentColumn] = (()=>{
      const parentElement = document.querySelectorAll(".kanban__column-items"); 
      for(let i=0;i<3;++i){
        for(const thisItem of Array.from(parentElement[i].children)){
          // console.log(thisItem.dataset.id);
          if(thisItem.dataset.id === itemId){
            return [thisItem, i];
          }
        }
      }

      return [null, -1];
    })();

    console.log(item, currentColumn);

    if (!item) {
      throw new Error("Item not found.");
    }

    item.content = newProps.content === undefined ? item.content : newProps.content;

    updateAssignmentStatus(itemId, currentColumn);

    
    // Update column and position
    // if (newProps.columnId !== undefined && newProps.position !== undefined) {
    //   const targetColumn = data.find(
    //     (column) => column.id == newProps.columnId
    //   );

    //   if (!targetColumn) {
    //     throw new Error("Target column not found.");
    //   }

    //   // Delete the item from it's current column
    //   currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

    //   // Move item into it's new column and position
    //   targetColumn.items.splice(newProps.position, 0, item);

    // }

    // save(data);
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

const getUserProfile = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  return await fetch(
    `http://${backendIPAddress}/courseville/get_profile_info`,
    options
  )
    .then((response) => response.json());
};

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

async function updateAssignmentStatus(assignmentCode, newStatus){
  const options = {
    method: "PUT",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/assignment/status/${assignmentCode}/${newStatus}`,
    options
  );
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

  let assignments = await getCourseAssignments(32201);
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

function clearItem() {
  const parentElement = document.getElementsByClassName("kanban__column-items"); // replace "parent-element" with the ID of the element you want to clear
  // const 
  for (let i = 0; i < parentElement.length; ++i) {
    const allChild = parentElement[i].getElementsByClassName("kanban__item");
    for (let j = allChild.length - 1; j >= 0; --j) {
      parentElement[i].removeChild(allChild[j]);
    }
  }
}

function addRowInColumn(parentElement, id, content){
  // const parentElement = document.getElementsByClassName("kanban__column-items"); // replace "parent-element" with the ID of the element you want to clear
  // const
  // const child = document.createRange().createContextualFragment(`
  //   <div class="kanban__item" draggable="true">
  //     <div class="kanban__item-input" contenteditable id="open-modal">${content}</div>
  //   </div>`
  // ).children[0];
  console.log(id);
  const child = new Item(id, content);
  console.log(child.elements.content, id);
  parentElement.appendChild(child.elements.root); 
}

function addItemColumn(data) {
  const parentElement = document.getElementsByClassName("kanban__column-items"); // replace "parent-element" with the ID of the element you want to clear
  // const 
  for(let i=0;i<3;++i){
    for(let j=0;j<data[i].items.length;++j){
      const child = document.createRange().createContextualFragment(`
      <div class="kanban__item" draggable="true">
        <div class="kanban__item-input" contenteditable id="open-modal">${data[i].items[j].content}</div>
      </div>`
      ).children[0];
      parentElement[i].appendChild(child);
    }
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
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body
  };
  await fetch(
    `http://${backendIPAddress}/assignment`,
    options
  );
}

const btn = document.getElementById("select-course");
btn.addEventListener("click", async () => {
  const selected = document.getElementById("course-name");
  console.log(selected.options[selected.selectedIndex].value);
  clearItem();
  const userId = (await getUserProfile()).user.id;

  let courses = await getCourseList();
  console.log(courses);
  let id = courses.find(
    (course) => course.title === selected.options[selected.selectedIndex].value
  );
  const cvcid = id.cv_cid;
  // console.log(id.cv_cid);

  let assignments = await getCourseAssignments(id.cv_cid);
  console.log(document.querySelectorAll(".kanban__column-items"));
  const parentElement = document.querySelectorAll(".kanban__column-items"); 
  // const parentElement = document.getElementsByClassName("kanban__column-items");
  let currentAssignments = [];
  for (const assignment of assignments.data) {
    const id = assignment.itemid;
    const content = assignment.title;
    // currentAssignments.push({
    //   id: assignment.itemid,
    //   content: assignment.title,
    // });
    const assignmentCode = [userId, String(cvcid), String(id)].join('-');
    const data = await getAssignmentById(assignmentCode);
    if (data.message == 'ok') {
      // currentBoard[Number(data.status)].items.push(data);
      addRowInColumn(parentElement[Number(data.status)], assignmentCode, content);
    } else {
      const data = {
        'assignmentCode': assignmentCode,
        'content': content,
        'status': '0',
      }
      await postAssignment(data);
      // currentBoard[0].items.push(data);
      addRowInColumn(parentElement[0], id, content);
    }
  }

  // let currentBoard = [
  //   { id: 1, items: [] },
  //   { id: 2, items: [] },
  //   { id: 3, items: [] },
  // ];
  // console.log(currentAssignments);
  // for (let i = 0; i < currentAssignments.length; ++i) {
  //   const assignmentCode = [userId, String(cvcid), String(currentAssignments[i].id)].join('-');
  //   const data = await getAssignmentById(assignmentCode);
  //   if (data.message == 'ok') {
  //     currentBoard[Number(data.status)].items.push(data);
  //   } else {
  //     const data = {
  //       'assignmentCode': assignmentCode,
  //       'content': currentAssignments[i].content,
  //       'status': '0',
  //     }
  //     await postAssignment(data);
  //     currentBoard[0].items.push(data);
  //   }
  // }
  // console.log(currentBoard);
  // addItemColumn(currentBoard);
  // currentBoard[0].items.push(...currentAssignments);
  // console.log(currentAssignments);
  // console.log(currentBoard);
  // KanbanAPI.getItems();
  // redrawDOM();
});

// remove old and add new assignment
function reRender() {
  const columns = document.querySelectorAll(".kanban__column");
}
