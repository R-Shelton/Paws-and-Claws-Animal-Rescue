/**
 * Contact form (contact.html).
 *
 * Checks the visitor's name, email and message, then sends the enquiry
 * through EmailJS, using the template configured in the EmailJS dashboard.
 * The form fields' name attributes must match the template variables:
 * {{name}}, {{email}} and {{message}}. Who receives the email, and whether
 * the visitor's address is used as To or Reply-To, is set in the template,
 * not here.
 *
 * The form carries `novalidate`, so the browser does not pop up its own
 * validation bubbles. The checks below run instead and write their messages
 * into the page, where they can be styled and read out by a screen reader.
 * The browser still parses the email address itself (see validateEmail).
 *
 * Requires the EmailJS browser SDK (global `emailjs`) to be loaded first.
 */

// Identifiers from the EmailJS dashboard (https://dashboard.emailjs.com).
// The public key is designed to be exposed in client-side code.
const EMAILJS_PUBLIC_KEY = "uuG61OpVX0SRRLRKt";
const EMAILJS_SERVICE_ID = "service_t55ajpg";
const EMAILJS_TEMPLATE_ID = "template_k9ot10o";

// Minimum gap between sends from one browser. Enforced client-side only, so
// it deters accidental repeats but not a determined abuser.
const SEND_THROTTLE_MS = 10000;

// HTTP status EmailJS rejects with when the throttle above is hit.
const RATE_LIMITED_STATUS = 429;

// Field limits. Lengths are measured after trimming, so spaces alone never
// satisfy a field the way the HTML `required` attribute would.
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 60;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 1000;

const SENDING_TEXT = "Sending...";
const RATE_LIMITED_TEXT = "Please wait a few seconds before trying again.";
const FAILURE_TEXT = "Sorry, something went wrong. Please try again later.";
const INVALID_FORM_TEXT = "Please correct the highlighted fields and try again.";

/**
 * Checks a visitor's name.
 *
 * Deliberately relaxed about which characters are allowed: real names carry
 * apostrophes, hyphens, spaces and letters from any alphabet, so the only
 * character rule is that a letter appears somewhere. That turns away "12345"
 * without turning away "O'Brien", "Anna-Marie" or "José".
 *
 * @param {string} value The raw field value.
 * @returns {string} The message to show, or "" when the name is acceptable.
 */
function validateName(value) {
    const name = value.trim();

    if (name === "") {
        return "Please enter your name.";
    }
    if (name.length < NAME_MIN_LENGTH) {
        return `Please enter at least ${NAME_MIN_LENGTH} characters.`;
    }
    if (name.length > NAME_MAX_LENGTH) {
        return `Please use ${NAME_MAX_LENGTH} characters or fewer.`;
    }
    // \p{L} is any letter in any alphabet, so this is not limited to A-Z.
    if (!/\p{L}/u.test(name)) {
        return "Please include at least one letter in your name.";
    }
    return "";
}

/**
 * Checks the enquiry message.
 *
 * @param {string} value The raw field value.
 * @returns {string} The message to show, or "" when the enquiry is usable.
 */
function validateMessage(value) {
    const message = value.trim();

    if (message === "") {
        return "Please enter your message.";
    }
    if (message.length < MESSAGE_MIN_LENGTH) {
        return `Please give a little more detail (at least ${MESSAGE_MIN_LENGTH} characters).`;
    }
    if (message.length > MESSAGE_MAX_LENGTH) {
        return `Please keep your message to ${MESSAGE_MAX_LENGTH} characters or fewer.`;
    }
    return "";
}

/**
 * Checks the email address.
 *
 * `novalidate` stops the browser reporting constraint violations, not
 * checking them, so the input's own reading of the address is still there in
 * validity.typeMismatch. Reusing it beats matching addresses with a regular
 * expression, which is notoriously easy to get wrong.
 *
 * @param {HTMLInputElement} input The email input itself, not its value.
 * @returns {string} The message to show, or "" when the address is usable.
 */
function validateEmail(input) {
    if (input.value.trim() === "") {
        return "Please enter your email address.";
    }
    if (input.validity.typeMismatch) {
        return "Please enter a valid email address, like name@example.com.";
    }
    return "";
}

function initContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) {
        console.error("Contact form not found in the DOM.");
        return;
    }

    // Named statusMessage, not message: the textarea's id is "message", and
    // element ids are also exposed as globals.
    const statusMessage = document.getElementById("contact-message");

    if (!statusMessage) {
        console.error("Contact status message not found in the DOM.");
        return;
    }

    const submitButton = form.querySelector("button[type='submit']");

    // The success copy lives in contact.html so it can be edited alongside the markup.
    const successText = statusMessage.textContent.trim();

    // Each field, the paragraph its error message goes in, and how it is
    // checked. Order matters: it decides which field focus lands on when
    // several are wrong at once.
    const fields = [
        {
            input: document.getElementById("name"),
            error: document.getElementById("name-error"),
            check: (input) => validateName(input.value),
        },
        {
            input: document.getElementById("email"),
            error: document.getElementById("email-error"),
            check: validateEmail,
        },
        {
            input: document.getElementById("message"),
            error: document.getElementById("message-error"),
            check: (input) => validateMessage(input.value),
        },
    ];

    if (fields.some((field) => !field.input || !field.error)) {
        console.error("A contact form field or its error paragraph is missing.");
        return;
    }

    const [nameField, emailField, messageField] = fields;

    // Re-checking as the visitor types only begins after the first submit, so
    // nobody is told a field is wrong while they are still filling it in.
    let hasAttemptedSubmit = false;

    /**
     * Shows or clears one field's error. An empty message clears it.
     *
     * aria-invalid marks the field for assistive tech, and the CSS uses it to
     * outline the field, so the error is not signalled by colour alone.
     */
    function showFieldError(field, message) {
        field.error.textContent = message;
        field.error.hidden = message === "";
        field.input.setAttribute("aria-invalid", message === "" ? "false" : "true");
    }

    /**
     * Checks every field and shows all of the errors at once, rather than
     * making the visitor fix them one submit at a time.
     *
     * @returns {object|null} The first field that failed, or null if all passed.
     */
    function validateAllFields() {
        let firstInvalid = null;

        fields.forEach((field) => {
            const message = field.check(field.input);
            showFieldError(field, message);
            if (message !== "" && firstInvalid === null) {
                firstInvalid = field;
            }
        });

        return firstInvalid;
    }

    fields.forEach((field) => {
        field.input.addEventListener("input", () => {
            if (hasAttemptedSubmit) {
                showFieldError(field, field.check(field.input));
            }
        });
    });

    function showMessage(text) {
        statusMessage.textContent = text;
        statusMessage.hidden = false;
    }

    form.addEventListener("submit", async (event) => {
        // Send through EmailJS instead of the browser's page-reloading POST.
        event.preventDefault();
        hasAttemptedSubmit = true;

        const firstInvalid = validateAllFields();
        if (firstInvalid !== null) {
            showMessage(INVALID_FORM_TEXT);
            // Moving focus reads that field and its error out to a screen
            // reader, and puts the cursor where the correction is needed.
            firstInvalid.input.focus();
            return;
        }

        submitButton.disabled = true; // Prevents double submits while in flight.
        showMessage(SENDING_TEXT);

        try {
            // Every named field in the form becomes a template variable.
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, {
                publicKey: EMAILJS_PUBLIC_KEY,
                limitRate: { throttle: SEND_THROTTLE_MS },
                email: emailField.input.value,
                name: nameField.input.value,
                message: messageField.input.value,
            });
            showMessage(successText);
            form.reset();
            // An emptied form is not a wrong one: drop the errors and go back
            // to checking only on submit.
            hasAttemptedSubmit = false;
            fields.forEach((field) => showFieldError(field, ""));
        } catch (error) {
            console.error("Contact form submission failed:", error);
            showMessage(
                error && error.status === RATE_LIMITED_STATUS
                    ? RATE_LIMITED_TEXT
                    : FAILURE_TEXT
            );
        } finally {
            submitButton.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", initContactForm);
