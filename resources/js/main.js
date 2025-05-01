class player {
    constructor(name, number) {
        this.name = name;
        this.number = number;
    }

    goalsValue = 0;
    assistsValue = 0;
    savesValue = 0;
    passesValue = 0;
}

let players = [];
const goalsButton = document.getElementById("playerGoals");
let timer;


document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.length > 0) {
        loadPlayers();
    }
});


// #region LOAD

function loadPlayers() {
    for (let playerNumber = 1; playerNumber < localStorage.length + 1; playerNumber++) {

        const player = getSettingObject(playerNumber);
        if (player != null) {
            players.push(player);
            clonePlayerNodeAndSetup(player);
        }
    }
}

function setupGame() {

    localStorage.clear();

    players = [];

    document.getElementById("playerslots").replaceChildren();
}

function createPlayers(numberOfPlayers) {
    for (let playerNumber = 1; playerNumber < numberOfPlayers + 1; playerNumber++) {
        let p = new player(playerNumber, (playerNumber == 1) ? true : false);

        if (playerNumber == 1) {
            // Game is being setup, human player is player 1 and has
            // initiative and is set to be the current player
            p.hasInitiative = true;
            currentPlayer = p;
        };

        players.push(p);

        clonePlayerNodeAndSetup(p);
    }
}

function clonePlayerNodeAndSetup(player) {
    const playertemplate = document.getElementById("playerTemplate").cloneNode(true);
    playertemplate.id = "name_" + player.name;
    playertemplate.classList.remove("d-none");
    playertemplate.querySelector('#' + "playerName").innerHTML = player.name;

    cloneAndSetupButtons(playertemplate, player, "Goals");
    cloneAndSetupButtons(playertemplate, player, "Assists");
    cloneAndSetupButtons(playertemplate, player, "Passes");
    cloneAndSetupButtons(playertemplate, player, "Saves");

    /*

    playertemplate.querySelector('#' + "playerAssists").innerHTML = player.assistsValue;
    playertemplate.querySelector('#' + "playerAssists").id = player.name + "_Assists";

    playertemplate.querySelector('#' + "playerSaves").innerHTML = player.savesValue;
    playertemplate.querySelector('#' + "playerSaves").id = player.name + "_Saves";

    playertemplate.querySelector('#' + "playerPasses").innerHTML = player.passesValue;
    playertemplate.querySelector('#' + "playerPasses").id = player.name + "_Passes";

    */

    document.getElementById("playerslots").appendChild(playertemplate);
}

let isLongClick = false;

const startTimer = (event) => {
    event.preventDefault();
    const button = document.getElementById(event.currentTarget.id);
    timer = setTimeout(() => {
        //alert('Long click detected!');
        isLongClick = true;
        statClick(button, -1);
    }, 500); // 1000 milliseconds = 1 second
};

const clearTimer = (event) => {
    event.preventDefault();
    const button = document.getElementById(event.currentTarget.id)
    clearTimeout(timer);
    if (!isLongClick) {
        statClick(button, 1);
    } else {
        isLongClick = false;
    }
};


function cloneAndSetupButtons(playertemplate, player, buttonName) {
    const button = playertemplate.querySelector('#player' + buttonName);

    button.innerHTML = player.goalsValue;

    switch (buttonName) {
        case "Goals":
            button.innerHTML = player.goalsValue;
            break;

        case "Assists":
            button.innerHTML = player.assistsValue;
            break;

        case "Passes":
            button.innerHTML = player.passesValue;
            break;

        case "Saves":
            button.innerHTML = player.savesValue;
            break;

        default:
            break;
    }

    button.id = player.name + "_" + buttonName;

    button.addEventListener('mousedown', startTimer);
    button.addEventListener('mouseup', clearTimer);
    //goalsButton.addEventListener('mouseleave', clearTimer);

    // Add touch events for mobile compatibility
    button.addEventListener('touchstart', startTimer, { passive: false });
    button.addEventListener('touchend', clearTimer, { passive: false });

    //goalsButton.addEventListener('touchcancel', clearTimer);
}

function addPlayer() {
    let playerName = prompt("Please enter the player's name", "name");
    if (playerName == null || playerName == "") {
        //text = "User cancelled the prompt.";
    } else {
        const newPlayer = new player(playerName, localStorage.length + 1);
        clonePlayerNodeAndSetup(newPlayer);
        players.push(newPlayer);
        SaveAllSettings();
    }
}

function statClick(button, value) {
    //const div = document.getElementById(id);

    let num = parseInt(button.innerHTML);
    num += value; //1;

    button.innerHTML = num;

    const playerName = button.id.split("_");
    const player = getPlayerByName(playerName[0]);

    switch (playerName[1]) {
        case "Goals":
            player.goalsValue += value;
            break;

        case "Assists":
            player.assistsValue += value;
            break;

        case "Passes":
            player.passesValue += value;
            break;

        case "Saves":
            player.savesValue += value;
            break;

        default:
            break;
    }

    SaveAllSettings();
}

function statClick_old(id) {
    const div = document.getElementById(id);

    let num = parseInt(div.innerHTML);
    num += 1;

    div.innerHTML = num;

    const playerName = id.split("_");
    const player = getPlayerByName(playerName[0]);

    switch (playerName[1]) {
        case "Goals":
            player.goalsValue += 1;
            break;

        case "Assists":
            player.assistsValue += 1;
            break;

        case "Saves":
            player.savesValue += 1;
            break;

        case "Passes":
            player.passesValue += 1;
            break;

        default:
            break;
    }

    SaveAllSettings();
}

function getPlayerByName(playerName) {
    let player;
    players.forEach(p => {
        if (p.name == playerName) {
            player = p;
        }
    })

    return player;
}

// #region SAVE

const GetSettingsByValue = (val, includes = false) => {
    let settings = new Array();
    for (let [key, value] of Object.entries(localStorage)) {
        if (includes && value.includes(val)) {
            settings.push(key + "," + value);
        } else if (value == val) {
            settings.push(key + "," + value);
        }
    }
    return settings;
};

const GetSettingsByKey = (val, includes = false) => {
    let settings = new Array();
    for (let [key, value] of Object.entries(localStorage)) {
        if (includes && key.includes(val)) {
            settings.push(key + "," + value);
        } else if (key == val) {
            settings.push(key + "," + value);
        }
    }
    return settings;
};

const GetSettingValueByKey = (keytofind) => {
    for (let [key, value] of Object.entries(localStorage)) {
        if (key == keytofind) {
            return value;
        }
    }

    return "";
};

const SaveSetting = (key, value) => {
    localStorage.setItem(key, value);
};

const SaveSettings = (settings) => {
    for (let [key, value] of Object.entries(settings)) {
        localStorage.setItem(key, value);
    }

};

const SaveAllSettings = () => {
    savePlayers();
}

const saveSettingObject = (settingName, settingObject) => {
    localStorage.setItem(settingName, JSON.stringify(settingObject));
};

const getSettingObject = (settingName) => {
    return JSON.parse(localStorage.getItem(settingName));
};

const RemoveSettingByKey = (k) => {
    for (let [key, value] of Object.entries(localStorage)) {
        if (key === k) {
            localStorage.removeItem(key);
        }
    }
};

const RemoveSettingByValue = (val) => {
    for (let [key, value] of Object.entries(localStorage)) {
        if (value === val) {
            localStorage.removeItem(key);
        }
    }
};

function savePlayers() {
    players.forEach(player => {
        saveSettingObject(player.number, player);
    });
}