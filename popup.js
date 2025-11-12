const midDelayInput = document.getElementById("midDelay");
const deltaDelayInput = document.getElementById("deltaDelay");
const outputSpan = document.getElementById("output");
const saveBtn = document.getElementById("save");

chrome.storage.sync.get(["midDelay", "deltaDelay", "deltaType"], (res) => {
  if (res.midDelay !== undefined) midDelayInput.value = res.midDelay;
  if (res.deltaDelay !== undefined) deltaDelayInput.value = res.deltaDelay;

  if (res.deltaType) {
    const radio = document.querySelector(`input[name="deltaType"][value="${res.deltaType}"]`);
    if (radio) radio.checked = true;
  }
});

saveBtn.addEventListener("click", () => {
  const midDelay = parseFloat(midDelayInput.value.trim()) || 0;
  const deltaDelay = parseFloat(deltaDelayInput.value.trim()) || 0;
  const deltaType = document.querySelector('input[name="deltaType"]:checked')?.value || "mean";

  chrome.storage.sync.set({ midDelay, deltaDelay, deltaType }, () => {
    outputSpan.textContent = "Ustawienia zapisane!";
    setTimeout(() => (outputSpan.textContent = ""), 2000);
  });
});
