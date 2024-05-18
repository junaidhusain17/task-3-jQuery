var query_String = window.location.search;
var urlParams = new URLSearchParams(query_String);
var id = urlParams.get("id");

$(document).ready(function () {
  var formValidator;
  //custom validation method for first and last name
  $.validator.addMethod("lettersOnly", function(value, element) {
    return this.optional(element) || /^[^\s]+[a-zA-Z\s]+([a-zA-Z]+)*$/.test(value);
  });
// custom for account accept alphanumeric characters
$.validator.addMethod("alphanumeric", function(value, element) {
  return this.optional(element) || /^[\w.]+$/i.test(value);
});
  formValidator = $("#contactForm").validate({
    rules: {
      fname: {
        required: true,
        lettersOnly: true,
        minlength: 3,
        maxlength: 20,
      },
      lname: {
        required: true,
        lettersOnly: true,
        minlength: 3,
        maxlength: 20,
      },
      email: {
        required: true,
        properEmail: true,
        maxlength: 35
      },
      contact: {
        required: true,
        number: true,
        minlength: 11,
        maxlength: 11,
      },
      account: {
        required: true,
        alphanumeric: true,
        maxlength: 25,
      },
      company: {
        required: true,
        maxlength: 25,
      },
      gridCheck: {
        required: true,
      },
    },
    messages: {
      fname: {
        required: "First name is a required field",
        lettersOnly: "Please enter only letters",
        minlength: "Minimum length is 3 characters",
        maxlength: "Maximum length is 20 characters",
      },
      lname: {
        required: "Last name is a required field",
        lettersOnly: "Please enter only letters",
        minlength: "Minimum length is 3 characters",
        maxlength: "Maximum length is 20 characters",
      },
      email: {
        required: "Email is a required field",
        properEmail: "Please enter a valid email address",
        maxlength: "Maximum length is 35 characters",
      },
      contact: {
        required: "Contact number is a required field",
        number: "Enter only Numbers",
        minlength: "Minimum length is 11 characters",
        maxlength: "Maximum length is 11 characters",
      },
      account: {
        required: "Account is a required field",
        alphanumeric: "please enter only letters and numbers",
        maxlength: "Maximum length is 25 characters",
      },
      company: {
        required: "Company is a required field",
        maxlength: "Maximum length is 25 characters",
      },
      gridCheck: {
        required: "Please check the box",
      },
    },

    invalidHandler: function (event, validator) {
      var errors = validator.numberOfInvalids();
      if (errors) {
        validator.showErrors();
      }
    },
    submitHandler: function () {
      var data = prepareData();

      var result = saveContact(data);

      // alert("Form submitted!");
      window.location.href = "listing-page.html";
    },
  });

  // Get data from localStorage and populate the table on page load
  var storeData = localStorage.getItem("formData");
  var formArray = storeData ? JSON.parse(storeData) : [];
  populateTable(formArray);

  // clear button
  $("#resetButton").on("click", function () {
    formValidator.resetForm();
    $("#contactForm")[0].reset();
  });

 // Add event listener for delete actions
$(".delete-row").on("click", function (e) {
  e.preventDefault();

  if (confirm("Are you sure! you want to Delete this record.")) {
    var indexToDelete = $(this).data("index");
    formArray.splice(indexToDelete, 1);
    localStorage.setItem("formData", JSON.stringify(formArray));
    populateTable(formArray);
    window.location.href = "listing-page.html";
  }
});

});

function prepareData() {
  alert("test");
  var formData = {  
    fname: $("#fname").val(),
    lname: $("#lname").val(),
    email: $("#email1").val(),
    contact: $("#contact-no").val(),
    account: $("#account").val(),
    company: $("#company").val(),
    status: $("#toggleSwitch").prop("checked") ? "on" : "off",
    country: $("#inputGroupSelect01").val(),
    subject: $("#Textarea1").val(),
    check: $("#gridCheck").val(),
  };

  return formData;
}

function saveContact(formData) {
  // get data from localStorage
  alert("test");
  var storeData = localStorage.getItem("formData");
  // convert stored data into array or initialize an empty array
  var formArray = storeData ? JSON.parse(storeData) : [];

  if (id && formArray[id]) {
    formArray[id] = formData;
  } else {
    // Push new data in array
    formArray.push(formData);
  }

  // Store the updated array in localStorage
  localStorage.setItem("formData", JSON.stringify(formArray));
  return true;
}

// Function to populate the table
function populateTable(formArray) {
  var table = $("#data-table tbody");
  // Clear existing rows in the table
  table.empty();

  // Iterate over the formArray and populate the table
  $.each(formArray, function (index, formData) {
    var newRow = $("<tr>");
    newRow.append('<th scope="row">' + (index + 1) + "</th>");
    newRow.append("<td>" + formData.fname + "</td>");
    newRow.append("<td>" + formData.lname + "</td>");
    newRow.append("<td>" + formData.email + "</td>");
    newRow.append("<td>" + formData.contact + "</td>");
    newRow.append("<td>" + formData.account + "</td>");
    newRow.append("<td>" + formData.company + "</td>");
    newRow.append("<td>" + formData.status + "</td>");
    newRow.append("<td>" + formData.country + "</td>");
    newRow.append("<td>" + formData.subject + "</td>");

    newRow.append(
      '<td><a href="#" class="delete-row btn btn-danger mx-2" data-index="' +
        index +
        '">Delete</a></td>',
      '<td><a href="/learnnextjs/index.html?id=' +
        index +
        '" class="edit-row btn btn-primary" data-index="' +
        index +
        '">Edit</a></td>'
    );

    // Append the new row to the table
    table.append(newRow);
  });

  // Check if the 'id' variable is defined before using it
  if (typeof id !== 'undefined') {
    var dataToPopulate = formArray[id];

    // Check if data exists for the given id
    if (dataToPopulate) {
      $("#fname").val(dataToPopulate.fname);
      $("#lname").val(dataToPopulate.lname);
      $("#email1").val(dataToPopulate.email);
      $("#contact-no").val(dataToPopulate.contact);
      $("#account").val(dataToPopulate.account);
      $("#company").val(dataToPopulate.company);
      $("#toggleSwitch").prop("checked", dataToPopulate.status === "on");
      $("#inputGroupSelect01").val(dataToPopulate.country);
      $("#Textarea1").val(dataToPopulate.subject);
      $("#gridCheck").prop("checked", dataToPopulate.check === "on");
    } else {
      console.log("Data not found for id: " + id);
    }
  } else {
    console.log("id is not defined");
  }
}

