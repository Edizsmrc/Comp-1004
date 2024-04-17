document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("retrieveData").addEventListener("click", function (event) { 
        event.preventDefault();// This prevents the html from submitting the form.
        const name = document.getElementById("nameInput").value.trim();
        if (!name) {
            alert("Please enter your name."); // This forces you to put a name so the data can be saved.
            return;
        }
        // This section reads the data from the server.
        fetch('/userData')
            .then(response => response.json())
            .then(data => {
                if (data[name]) { // Check if the data contains the key corresponding to the user's name.
                    displayResults(data[name]);
                } else {
                    alert("No data found for this name."); // If the user writes a name that is not on the database, this message will show and let the user write again.
                }
            })
            .catch(error => console.error('Error retrieving data:', error)); // This is the message pops at the console on the browser for error checking. If the data cannot be retrieved.
    });

    document.getElementById("virusCheckForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // This are retrieves the data inputs from the user.
        const name = document.getElementById("name").value.trim();
        const slow = document.querySelector('input[name="slow"]:checked').value;
        const popups = document.querySelector('input[name="popups"]:checked').value;
        const antivirus = document.querySelector('input[name="antivirus"]:checked').value;
        const updateDate = document.getElementById("updateDate").value;
        const suspiciousEmails = document.querySelector('input[name="suspiciousEmails"]:checked').value;
        const weirdPrograms = document.querySelector('input[name="weirdPrograms"]:checked').value;
        const encryptFiles = document.querySelector('input[name="encryptFiles"]:checked').value;
        const unauthorizedAccess = document.querySelector('input[name="unauthorizedAccess"]:checked').value;
        const actionsTaken = document.getElementById("actionsTaken").value;

        const userData = { // This saves the data like an object.
            name: name,
            slow: slow,
            popups: popups,
            antivirus: antivirus,
            updateDate: updateDate,
            suspiciousEmails: suspiciousEmails,
            weirdPrograms: weirdPrograms,
            encryptFiles: encryptFiles,
            unauthorizedAccess: unauthorizedAccess,
            actionsTaken: actionsTaken
        };

        // This displays the results.
        displayResults(userData);

        // This section saves the data to the server.
        fetch('/userData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [name]: userData }), // Wrap userData in an object with name as key.
        })
            .then(response => {
                if (!response.ok) {//If there is no respons from the server, print this code to the console.
                    throw new Error('Network response was not ok');
                }
                console.log('Data saved successfully!');
            })
            .catch(error => console.error('Error saving data:', error));

    });

    // Displaying results.
    function displayResults(userData) { // These are the variables for the answers printed.
        let virusType1 = "";
        let virusType2 = "";
        let virusType3 = "";

        let advice = "You may have: ";
        let advice4 = "";
        // These are the if statemnts for the correct answer depending on the choices.
        if (userData.slow === "yes" || userData.popups === "yes") {
            virusType1 = "- Adware or Spyware. ";
        }
        if (userData.suspiciousEmails === "yes" || userData.weirdPrograms === "yes") {
            virusType2 = "- Trojan or Keylogger. ";
        }
        if (userData.encryptFiles === "yes" || userData.unauthorizedAccess === "yes") {
            virusType3 = "- Ransomware or CryptoLocker. ";
        }

        if (userData.antivirus === "yes") {
            if (userData.updateDate === "") {
                advice4 += "Make sure to update your antivirus regularly. ";
            } else {
                advice4 += "Your antivirus seems up to date. ";
            }
        } else {
            advice4 += "Consider installing an antivirus software for added protection. ";
        }
        //Displaying the answers and advices to get rid of the problem.
        document.getElementById("advice0").textContent = `Results for ${userData.name}, ${advice}`;
        document.getElementById("advice1").textContent = `${virusType1}`;
        document.getElementById("advice2").textContent = `${virusType2}`;
        document.getElementById("advice3").textContent = `${virusType3}`;
        document.getElementById("advice4").textContent = `${advice4}`;
        document.getElementById("result").classList.remove("hidden");
        
    }
});
