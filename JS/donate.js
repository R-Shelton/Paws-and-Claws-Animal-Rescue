/**
 * Donate page (donate.html).
 *
 * - Clicking an amount highlights it and clears the previous choice.
 * - Clicking "Donate Now" opens a thank-you dialog the visitor can close
 *   (Close button, Esc, or a click on the backdrop).
 *
 * Front-end flow only: no payment is processed.
 */

function initDonatePage() {
    const amountButtons = document.querySelectorAll(".donate-amount-bubble");
    const recurringCheckbox = document.querySelector(".donate-recurring-checkbox");
    const donateButton = document.getElementById("donate-submit");
    const hint = document.getElementById("donate-hint");
    const dialog = document.getElementById("donate-thanks");
    const thanksText = document.getElementById("donate-thanks-text");
    if (!donateButton || !hint || !dialog || !thanksText) {
        return;
    }

    let selectedAmountButton = null;

    amountButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // aria-pressed is the single source of truth: the CSS highlights
            // [aria-pressed="true"] and assistive tech announces the state.
            amountButtons.forEach((other) => {
                other.setAttribute("aria-pressed", String(other === button));
            });
            selectedAmountButton = button;
            hint.hidden = true;
        });
    });

    donateButton.addEventListener("click", () => {
        // A thank-you for a donation that was never chosen would be misleading.
        if (!selectedAmountButton) {
            hint.hidden = false;
            return;
        }

        const amount = selectedAmountButton.textContent.trim();
        const frequency = recurringCheckbox && recurringCheckbox.checked ? " monthly" : "";
        thanksText.textContent =
            `Thank you for your ${amount}${frequency} donation! ` +
            "You're helping feed, shelter and care for a rescue.";
        dialog.showModal();
    });

    // The dialog has no padding of its own, so a click whose target is the
    // dialog itself landed on the backdrop rather than inside the popup.
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
}

document.addEventListener("DOMContentLoaded", initDonatePage);
