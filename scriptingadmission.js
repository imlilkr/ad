<script>
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
</script>

<script>
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };

        reader.readAsDataURL(input.files[0]);
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



</script>




   

<script>

document.getElementById("admissionForm").addEventListener("submit", async function (e) {

  e.preventDefault();
 //to show loading after submission

 const submitBtn = document.getElementById("submitBtn");
const processingOverlay = document.getElementById("processingOverlay");

submitBtn.disabled = true;

processingOverlay.style.display = "flex";

  // Hide old duplicate error
  document.getElementById("aadhaarDuplicateError").style.display = "none";

  const photoInput = document.getElementById("photoUpload");
  const thumbInput = document.getElementById("thumbUpload");
  const photoInput2 = document.getElementById("photoUpload2");

  const photoFile = photoInput?.files?.[0] || null;
  const thumbFile = thumbInput?.files?.[0] || null;
  const photoFile2 = [...(photoInput2?.files || [])];


  //const photo = photoFile ? await toBase64(photoFile) : "";
  //const photo = photoFile ? {
  //name: photoFile.name,
  //data: await toBase64(photoFile)
//} : "";
  //const thumb = thumbFile ? await toBase64(thumbFile) : "";
  //const thumb = thumbFile ? {
  //name: thumbFile.name,
  //data: await toBase64(thumbFile)
//} : "";
  //const photo2 = await Promise.all(
  //photoFile2.map(file => toBase64(file))

  //const photo2 = await Promise.all(
  //uploadedFiles.map(file => toBase64(file))
//);
//);
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
    MobileNo1: this.MobileNo1.value,

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

  fetch("https://script.google.com/macros/s/AKfycbxl7oVIgw1XFXs7fzOq0HyLOk7WjNslOfUOpImuaDHAuVH4z0n7z7WDSJbAm-_r4GcZ/exec", {
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

      error.innerText = res.message;
      error.style.display = "block";

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

alert(res.message || "Submission failed");

  })
  .catch(err => {

    submitBtn.disabled = false;
    processingOverlay.style.display = "none";

    console.error(err);
    alert("Submission failed");

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

</script>
<script>
const aadhaar = document.getElementById("aadhaar");

if (aadhaar.value.length !== 12) {

    document.getElementById("aadhaarError").innerText =
      "Aadhaar number must contain exactly 12 digits";

    document.getElementById("aadhaarError").style.display =
      "block";

    return;
}

</script>

<script>
let uploadedFiles = [];

document.getElementById("photoUpload2")
.addEventListener("change", function () {

    const files = Array.from(this.files);

    files.forEach(file => {
        uploadedFiles.push(file);
    });

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

function removeImage(index) {

    uploadedFiles.splice(index, 1);

    renderPreviews();
}
</script>