// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";

const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

// TODO #3.1: Change group number
const getGroupNumber = () => {
  return 27;
};

// Example: Send Get user profile ("GET") request to backend server and show the response on the webpage
const getUserProfile = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/courseville/get_profile_info`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(
        "eng-name-info"
      ).innerHTML = `${data.user.title_en} ${data.user.firstname_en} ${data.user.lastname_en}`;
    });
};

// TODO #3.3: Send Get Courses ("GET") request to backend server and filter the response to get Comp Eng Ess CV_cid
//            and display the result on the webpage
const getCompEngEssCid = async () => {
  await fetch(`http://${backendIPAddress}/courseville/get_courses`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      console.log(data.data["student"]);
      document.getElementById("ces-cid-value").innerHTML =
        data.data.student.find(
          (course) => course.course_no === "2110221"
        ).cv_cid;
      // console.log(document.getElementById("ces-cid-value").innerHTML);
    });
};

// TODO #3.5: Send Get Course Assignments ("GET") request with cv_cid to backend server
//            and create Comp Eng Ess assignments table based on the response (itemid, title)
const createCompEngEssAssignmentTable = async () => {
  const table_body = document.getElementById("main-table-body");
  table_body.innerHTML = "";
  const cv_cid = document.getElementById("ces-cid-value").innerHTML;

  await fetch(
    `http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`,
    { method: "GET", credentials: "include" }
  )
    .then((response) => response.json())
    .then(({ data }) => {
      console.log("hello");
      data.map((assignment) => {
        table_body.innerHTML += `
          <tr>
            <td>${assignment.itemid}</td>
            <td>${assignment.title}</td>
          </tr> `;
      });
    });
};

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

document.getElementById("group-id").innerHTML = getGroupNumber();

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
      data.map((course) => {
        // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
        course_dropdown.innerHTML += `<option value="${course.cv_cid}">${course.course_no}</option>`;
        // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
      });
    })
    .catch((error) => console.error(error));
}

async;
