import Swal from 'sweetalert2';
/**
 * Displays a success alert with an optional callback.
 * @param {string} title - The title of the alert.
 * @param {string} text - The message to display.
 * @param {function} callback - Optional callback function to execute after confirmation.
 */
export const showSuccessAlert = (title, text, callback) => {
  Swal.fire({
    title: title || "Success!",
    text: text || "Operation completed successfully!",
    icon: "success",
    confirmButtonText: "OK",
  }).then((result) => {
    if (result.isConfirmed && typeof callback === "function") {
      callback(); // Execute the callback function when the OK button is clicked
    }
  });
};

/**
 * Displays an error alert.
 * @param {string} title - The title of the alert.
 * @param {string} text - The message to display.
 * @param {string} footer - Optional footer text.
 */
export const showErrorAlert = (title, text, footer) => {
  Swal.fire({
    icon: "error",
    title: title || "Error!",
    text: text || "Something went wrong!",
    footer: footer || null,
  });
};

/**
 * Displays an info alert.
 * @param {string} title - The title of the alert.
 * @param {string} text - The message to display.
 */
export const showInfoAlert = (title, text) => {
  Swal.fire({
    icon: "info",
    title: title || "Info!",
    text: text || "This is an informational message.",
  });
};

/**
 * Displays a confirmation alert with options to confirm or cancel.
 * @param {string} title - The title of the alert.
 * @param {string} text - The message to display.
 * @param {function} onConfirm - Callback function to execute if the user confirms.
 * @param {function} onCancel - Optional callback function to execute if the user cancels.
 */
export const showConfirmAlert = (title, text, onConfirm, onCancel) => {
  Swal.fire({
    title: title || "Are you sure?",
    text: text || "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, proceed!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed && typeof onConfirm === "function") {
      onConfirm(); // Execute the onConfirm callback if the user confirms
    } else if (typeof onCancel === "function") {
      onCancel(); // Execute the onCancel callback if the user cancels
    }
  });
};