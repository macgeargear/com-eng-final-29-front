export default class KanbanAPI {
  static async getItems(columnId) {
    const column = await read().find((column) => column.id == columnId);

    if (!column) {
      return [];
    }

    return column.items;
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

async function getCourseList() {
  const course_dropdown = document.getElementById("name-to-add");
  course_dropdown.innerHTML =
    "<option value='0'>-- Select Your Course --</option>";
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/courseville/get_courses`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.data.student);
      const course = data.data.student;
      course.map((course) => {
        // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
        console.log(course);
        course_dropdown.innerHTML += `<option value="${course.cv_cid}">${course.cv_cid}</option>`;
        // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
      });
    })
    .catch((error) => console.error(error));
}

async function read() {
  // const json = localStorage.getItem("kanban-data");
  // if (!json) {
  //   return [
  //     {
  //       id: 1,
  //       items: [],
  //     },
  //     {
  //       id: 2,
  //       items: [],
  //     },
  //     {
  //       id: 3,
  //       items: [],
  //     },
  //   ];
  // }
  // return JSON.parse(json);
  const assignment = await fetch(
    `http://${backendIPAddress}/courseville/get_course_assignments/32200`,
    { method: "GET", credentials: "include" }
  )
    .then((res) => res.json())
    .then(({ data }) => {
      console.log(data);
      return data;
    });
}

function save(data) {
  localStorage.setItem("kanban-data", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", async function (event) {
  await getCourseList();
});
