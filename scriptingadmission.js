//permanent address toggle // why chekcing only phone?
window.onload = function () {
    const checkbox = document.getElementById("sameAddress");
    const permanentFields = document.getElementById("permanentAddressFields");
    // Initial state when page loads
    permanentFields.style.display = checkbox.checked ? "none" : "block";
    // Toggle on check/uncheck
    checkbox.addEventListener("change", function () {
        permanentFields.style.display =
            this.checked ? "none" : "block";
    });
};

function previewImage(input, previewId) {

    const preview = document.getElementById(previewId);

    if (!input.files[0]) return;

    const file = input.files[0];

    // Allow only Images and PDF
    if (
        !file.type.startsWith("image/") &&
        file.type !== "application/pdf"
    ) {
        alert("Only Image and PDF files are allowed.");
        input.value = "";
        preview.style.display = "none";
        return;
    }

    // Maximum file size = 700 MB
    const MAX_SIZE = 100 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
        alert("File size must not exceed 100 MB.");
        input.value = "";
        preview.style.display = "none";
        return;
    }

    // Preview only images
    if (file.type.startsWith("image/")) {

        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };

        reader.readAsDataURL(file);

    } else {
        // PDF selected
        preview.style.display = "none";
    }
}




const photo = document.getElementById("photoUpload");
if (photo) {
  photo.addEventListener("change", function() {
    previewImage(this, "photoPreview");
  });
}

const thumb = document.getElementById("thumbUpload");
if (thumb) {
  thumb.addEventListener("change", function() {
    previewImage(this, "thumbPreview");
  });
}

//let uploadedFiles = [];

//document.getElementById("photoUpload2")
//.addEventListener("change", function () {

 //   const files = Array.from(this.files);

//    files.forEach(file => {
//        uploadedFiles.push(file);
  //  });

    //renderPreviews();

    //this.value = "";
//});//

let uploadedFiles = [];

document.getElementById("photoUpload2")
.addEventListener("change", function () {

    const files = Array.from(this.files);

    const MAX_SIZE = 100 * 1024 * 1024; // 100 MB per file

    // Validate all files first
    for (const file of files) {

        // Allow only Images and PDF
        if (
            !file.type.startsWith("image/") &&
            file.type !== "application/pdf"
        ) {
            alert(file.name + "\nOnly Image and PDF files are allowed.");
            this.value = "";
            return;
        }

        // Check file size
        if (file.size > MAX_SIZE) {
            alert(file.name + "\nFile size must not exceed 100 MB.");
            this.value = "";
            return;
        }
    }

    // If execution reaches here, ALL files are valid
    uploadedFiles.push(...files);

    renderPreviews();

    this.value = "";
});


function renderPreviews() {

    const container =
        document.getElementById("photoPreviewContainer");
    container.innerHTML = "";
    uploadedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const wrapper =
                document.createElement("div");
            wrapper.style.position = "relative";
            wrapper.innerHTML = `
                <img src="${e.target.result}"
                     style="
                        width:120px;
                        height:150px;
                        object-fit:cover;
                        border:1px solid #ccc;
                        border-radius:8px;
                     ">

                <button type="button"
                        onclick="removeImage(${index})"
                        style="
                            position:absolute;
                            top:-8px;
                            right:-8px;
                            width:24px;
                            height:24px;
                            border:none;
                            border-radius:50%;
                            background:red;
                            color:white;
                            cursor:pointer;
                            font-weight:bold;
                        ">
                    ×
                </button>
            `;

            container.appendChild(wrapper);
        };

        reader.readAsDataURL(file);

    });
}



   

//"Wait until the user submits the admission form."
document.getElementById("admissionForm").addEventListener("submit", async function (e) {
e.preventDefault();
const submitBtn = document.getElementById("submitBtn");
const processingOverlay = document.getElementById("processingOverlay");

submitBtn.disabled = true;
processingOverlay.style.display = "flex";

  // Hide old duplicate error after fixing the invalid data//check other duplicate error as well?
  document.getElementById("aadhaarDuplicateError").style.display = "none";

//Prepare all uploaded files so they can be sent to Google Apps Script.
  const photoInput = document.getElementById("photoUpload");
  const thumbInput = document.getElementById("thumbUpload");
  const photoInput2 = document.getElementById("photoUpload2");

  const photoFile = photoInput?.files?.[0] || null;
  const thumbFile = thumbInput?.files?.[0] || null;
  const photoFile2 = [...(photoInput2?.files || [])];


const photo = photoFile ? {
  name: photoFile.name,
  data: await toBase64(photoFile)
} : "";

const thumb = thumbFile ? {
  name: thumbFile.name,
  data: await toBase64(thumbFile)
} : "";

const photo2 = await Promise.all(
  uploadedFiles.map(async file => ({
    name: file.name,
    data: await toBase64(file)
  }))
);

console.log("PHOTO BASE64 EXISTS:", !!photo);
console.log("THUMB BASE64 EXISTS:", !!thumb);
console.log("photo2 BASE64 EXISTS:", !!photo2);


  const payload = {
    CourseApplied: this.CourseApplied.value,
    fullName: this.fullName.value,
    fatherName: this.fatherName.value,
    motherName: this.motherName.value,

    Street: this.Street.value,
    Area: this.Area.value,
    Village: this.Village.value,
    District: this.District.value,
    Pincode: this.Pincode.value,
    MobileNo: this.MobileNo.value,

    Street1: this.Street1.value,
    Area1: this.Area1.value,
    Village1: this.Village1.value,
    District1: this.District1.value,
    Pincode1: this.Pincode1.value,
    //MobileNo1: this.MobileNo1.value,

    DateofBirth: this.DateofBirth.value,
    email: this.email.value,

    gender:
      this.querySelector('input[name="gender"]:checked')?.value || "",

    category:
      this.querySelector('input[name="category"]:checked')?.value || "",

    aadhaar: this.aadhaar.value,
    qualification: this.qualification.value,

    photo: photo,
    thumb: thumb,
    photo2: photo2
  };

console.log("FULL PAYLOAD:");
console.log(payload);
console.log("PHOTO2:");
console.log(payload.photo2);

  fetch("https://script.google.com/macros/s/AKfycbxPSz9tqzYbgWb1NPfSDpFOKVkwbFRvGHMBL5TRBg9sUK8vDhAFO9pLfo_UjbhahUx9/exec", {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(res => {

    console.log(res);

    // DUPLICATE AADHAAR
    if (res.status === "duplicate") {
      const error =
        document.getElementById("aadhaarDuplicateError");
      showErrorPopup(res.message);
      submitBtn.disabled = false;
processingOverlay.style.display = "none";
return;
    }

    // SUCCESS
  
    if (res.status === "success") {
      alert("Form submitted successfully!");
submitBtn.disabled = false;
processingOverlay.style.display = "none";
      document.getElementById("admissionForm").reset();
      document.getElementById("aadhaarDuplicateError").style.display = "none";
      return;
    }

    // OTHER ERRORS
    submitBtn.disabled = false;
processingOverlay.style.display = "none";

showErrorPopup(
    res.message ||
    "Form submission failed. Kindly check the errors and try again."
);
  })
  .catch(err => {

    submitBtn.disabled = false;
    processingOverlay.style.display = "none";

    console.error(err);
   showErrorPopup(
    "Form submission failed. Kindly check your internet connection and try again."
);

});

});

function toBase64(file) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);

  });

}

// Hide duplicate message when Aadhaar changes
document.getElementById("aadhaar").addEventListener("input", function () {
  document.getElementById("aadhaarDuplicateError").style.display = "none";

});



const aadhaar = document.getElementById("aadhaar");

aadhaar.addEventListener("input", function () {

    if (this.value.length !== 12) {

        document.getElementById("aadhaarError").innerText ="Aadhaar number must contain exactly 12 digits";

        document.getElementById("aadhaarError").style.display ="block";

    } else {

        document.getElementById("aadhaarError").style.display ="none";
    }

});








function removeImage(index) {

    uploadedFiles.splice(index, 1);

    renderPreviews();
}


function showErrorPopup(message) {

    document.getElementById("errorMessage").innerText = message;

    document.getElementById("errorPopup").style.display = "flex";
}

function closeErrorPopup() {

    document.getElementById("errorPopup").style.display = "none";
}





const mobileNo = document.getElementById("mobileNo");

mobileNo.addEventListener("input", function () {

    // Allow only digits
    this.value = this.value.replace(/\D/g, "");

    if (this.value.length !== 10) {

        document.getElementById("mobileNoError").innerText =
            "Mobile number must contain exactly 10 digits and no Aplpha numeric";

        document.getElementById("mobileNoError").style.display = "block";

    } else {

        document.getElementById("mobileNoError").style.display = "none";

    }

});
